import {
  Button,
  Input,
  Table,
  Modal,
  Radio,
  Checkbox,
  message,
  Popconfirm,
} from 'antd';
import type { RadioChangeEvent } from 'antd';
import React, { useEffect, useState } from 'react';
import { request } from 'umi';

interface Song {
  id: number;
  artist: string;
  name: string;
  play_list_id: number;
  quality: number;
  song_id: number;
  qualityText: string;
  status: string;
}

let dirHandle: {
  getFileHandle: (arg0: string, arg1: { create: boolean }) => any;
} | null = null;

export default function () {
  const [playListId, setPlayListId] = useState(0);
  const [qualitySelect, setQualitySelect] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<Array<Song>>([]);
  const [loading, setLoading] = useState(false);
  const [isNewListModalOpen, openNewListModal] = useState(false);
  const [isDownloadModalOpen, openDownloadModal] = useState(false);
  const [emptyCount, setEmptyCount] = useState(0);

  const add = (playListId: number) => {
    request('/api/song/play_list/add', {
      params: {
        playlist_id: playListId,
      },
    }).then(() => {
      openNewListModal(false);
    });
  };

  async function verifyPermission(fileHandle: any, readWrite: boolean) {
    const options = {
      mode: 'read',
    };
    if (readWrite) {
      options.mode = 'readwrite';
    }
    if ((await fileHandle.queryPermission(options)) === 'granted') {
      return true;
    }

    return (await fileHandle.requestPermission(options)) === 'granted';
  }

  async function getBlob(s: Song) {
    const urlToGet =
      'https://api.dydq.xyz' +
      '/api/song/' +
      s.id +
      '/' +
      s.quality +
      '/download.cache';
    const data = await fetch(urlToGet);
    console.log(urlToGet);
    if (data.status !== 200) {
      message.warning('服务器错误:' + data.statusText);
      s.status = '服务器错误:' + data.statusText;
      return;
    }

    const ext: string | null = data.headers.get('FileExt');
    console.log(s.id, '扩展名', ext);
    if (ext === null || ext.length === 0) {
      return;
    }

    // return data.blob();

    const filename = (s.name + '-' + s.artist + ext).replaceAll(
      /[\\\\/:*?\\"<>|]/g,
      '',
    );
    console.log(filename);
    s.status = '开始下载' + filename;
    message.info('开始下载' + filename);
    const fileHandle = await dirHandle?.getFileHandle(filename, {
      create: true,
    });

    if (fileHandle === null) {
      console.error('get file handle' + fileHandle);
      return;
    }

    console.log(fileHandle);

    if (await verifyPermission(fileHandle, true)) {
      const writable = await fileHandle.createWritable();
      await writable.write(await data.blob());
      await writable.close();
      s.status = '下载完成';
    }
  }

  const download = async (id: string | number | null = null) => {
    // debugger
    if (dirHandle === null) {
      console.log('no permission');
      dirHandle = await window.showDirectoryPicker({
        startIn: 'music', //default folder
        writable: true, //ask for write permission
      });
      await download(id);
      return;
    }

    if (id !== null && id > 0) {
      let i = data.find((n) => n.song_id === id);
      if (i !== undefined) {
        await getBlob(i);
      }
    } else {
      for (const i of data) {
        if (i.quality < 5) {
          await getBlob(i);
        }
      }
    }
  };

  const loadPlayList = (playListId: number) => {
    if (playListId <= 0) {
      return;
    }
    setLoading(true);
    request('/api/songs/play_list/' + playListId, {
      params: {
        page: currentPage,
        pageSize: pageSize,
      },
    }).then((resp) => {
      const { data, total } = resp;
      setEmptyCount(0);
      data.map((i: Song) => {
        const qualityText = ['FLAC', 'm4a', '320K', '128K', 'ERROR'];
        i.qualityText = qualityText[i.quality - 1] ?? 'ERROR';
        if (i.quality > 4) {
          setEmptyCount((e) => e + 1);
        }
        return i;
      });
      setLoading(false);
      openNewListModal(data.length === 0);
      setTotal(total);
      setData(data);
    });
  };

  useEffect(() => {
    loadPlayList(playListId);
  }, [pageSize, currentPage]);

  const columns = [
    {
      title: '歌单ID',
      dataIndex: 'play_list_id',
    },
    {
      title: '歌曲ID',
      dataIndex: 'song_id',
    },
    {
      title: '歌曲名',
      dataIndex: 'name',
    },
    {
      title: '歌手',
      dataIndex: 'artist',
    },
    {
      title: '音质',
      dataIndex: 'qualityText',
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
    {
      title: '下载',
      render: (_: any, record: { song_id: number }) =>
        data.length >= 1 ? (
          <Popconfirm
            title="确认要下载吗"
            onConfirm={() => download(record.song_id)}
          >
            <Button>下载</Button>
          </Popconfirm>
        ) : null,
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <Input.Group compact style={{ width: '400px' }}>
          <Input
            placeholder="输入歌单ID"
            style={{ width: '300px' }}
            onChange={(e) => setPlayListId(Number(e.target.value))}
          />
          <Button
            type="primary"
            onClick={() => {
              loadPlayList(playListId);
            }}
          >
            导入
          </Button>
        </Input.Group>
      </div>
      <Input.Group>
        {/*<Input placeholder='保存位置' />*/}
        <Radio.Group
          value={qualitySelect}
          onChange={(e: RadioChangeEvent) => setQualitySelect(e.target.value)}
        >
          <Radio value={1}>优先下载最高品质</Radio>
          <Radio value={2} disabled={true}>
            优先下载最低品质
          </Radio>
          <Radio value={3} disabled={true}>
            全部下载
          </Radio>
        </Radio.Group>
        <Checkbox disabled={true}>同时下载歌词</Checkbox>
        <Checkbox disabled={true}>同时下载封面</Checkbox>
        <Button type="primary" onClick={() => openDownloadModal(true)}>
          下载当前列表所有歌曲
        </Button>
      </Input.Group>

      <Modal
        title="下载确认"
        open={isDownloadModalOpen}
        onCancel={() => openDownloadModal(false)}
        confirmLoading={loading}
        onOk={() => {
          openDownloadModal(true);
          download().then(() => openDownloadModal(false));
        }}
      >
        <p>当前一共有 {data.length} 首歌曲，确定全部下载吗？</p>
        <p>下载不支持断点续传，所以请尽量不要操作浏览器</p>
        {emptyCount === 0 ? (
          <></>
        ) : (
          <p style={{ color: 'red' }}>
            有 {emptyCount} 首歌曲没有资源!请确认任务是否执行完成
          </p>
        )}
      </Modal>
      <Modal
        title="创建导入任务"
        open={isNewListModalOpen}
        onCancel={() => openNewListModal(false)}
        confirmLoading={loading}
        onOk={() => add(playListId)}
      >
        <p>歌单不存在需要导入，处理过程需要1-2小时，请勿重复提交</p>
        <p>
          服务器流量成本不菲，如果这个工具帮助到了你，你可以捐助我们，一遍我们持续运行
        </p>
      </Modal>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          defaultCurrent: 1,
          total: total,
          pageSize: pageSize,
          onChange: (page, pageSize) => {
            setPageSize(pageSize);
            setCurrentPage(page);
          },
        }}
      />
    </div>
  );
}
