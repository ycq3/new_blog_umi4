import { HomeOutlined } from '@ant-design/icons';
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
import React, { Component } from 'react';
import { request } from 'umi';
import { WechatQrCode, PinChecker } from '@/components/WechatQrCode';

// import ex from 'umi/dist';

// import { FileSystemGetFileOptions } from 'wicg-file-system-access';

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

interface MusicState {
  data: Array<Song>;
  currentPage: number;
  pageSize: number;
  total: number;
  playListId: number;
  isModalOpen: boolean;
  loading: boolean;
  qualitySelect: number;
  emptyCount: number;
  pin: number;
  verify: boolean;
  isNewListModalOpen: boolean;
}

export default class MusicPage extends Component<any, MusicState> {
  public static menu = {
    name: '歌单下载', // 兼容此写法
    icon: <HomeOutlined />,
  };

  private dirHandle: FileSystemDirectoryHandle | undefined;

  state = {
    data: Array<Song>(),
    currentPage: 1,
    pageSize: 15,
    total: 0,
    playListId: 0,
    isModalOpen: false,
    loading: true,
    qualitySelect: 1,
    emptyCount: 0,
    verify: false,
    pin: 0,
    isNewListModalOpen: false,
  };

  componentDidMount() {
    if (process.env.NODE_ENV === 'development') {
      this.setState({ pin: 427485, playListId: 2603575627 });
    }
    this.loadPlayList(this.state.playListId);
  }

  add(playListId: number) {
    const { pin } = this.state;
    request('/api/song/play_list/add', {
      params: {
        playlist_id: playListId,
        key: pin,
      },
    }).then(() => {
      this.setState({ isNewListModalOpen: false });
    });
  }

  loadPlayList(playListId: number) {
    if (playListId <= 0) {
      return;
    }
    this.setState({ loading: true });
    const { currentPage, pageSize } = this.state;
    request('/api/songs/play_list/' + playListId, {
      params: {
        page: currentPage,
        pageSize: pageSize,
      },
    }).then((resp) => {
      const { data, total } = resp;
      let emptyCount = 0;
      data.map((i: Song) => {
        const qualityText = ['FLAC', 'm4a', '320K', '128K', 'ERROR'];
        i.qualityText = qualityText[i.quality - 1] ?? 'ERROR';
        if (i.quality > 4) {
          emptyCount++;
        }
        return i;
      });

      this.setState({
        data: data,
        total: total,
        loading: false,
        emptyCount: emptyCount,
        isNewListModalOpen: data.length === 0,
      });
    });
  }

  async download(id: string | number | null = null) {
    // debugger
    if (this.dirHandle === null) {
      console.log('no permission');
      this.dirHandle = await window.showDirectoryPicker({
        startIn: 'music', //default folder
        writable: true, //ask for write permission
      });
      await this.download(id);
      return;
    }

    const { data } = this.state;
    // this.dirHandle

    if (id !== null && id > 0) {
      let i = data.find((n) => n.song_id === id);
      if (i !== undefined) {
        await this.getBlob(i);
      }
    } else {
      for (const i of data) {
        if (i.quality < 5) {
          await this.getBlob(i);
        }
      }
    }
  }

  async getBlob(s: Song) {
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
    const fileHandle = await this.dirHandle?.getFileHandle(filename, {
      create: true,
    });

    if (fileHandle === null) {
      console.error('get file handle' + fileHandle);
      return;
    }

    console.log(fileHandle);

    if (await this.verifyPermission(fileHandle, true)) {
      const writable = await fileHandle.createWritable();
      await writable.write(await data.blob());
      await writable.close();
      s.status = '下载完成';
    }
  }

  async verifyPermission(fileHandle: any, readWrite: boolean) {
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

  render(): React.ReactNode {
    const dataSource = this.state.data;

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
          dataSource.length >= 1 ? (
            <Popconfirm
              title="确认要下载吗"
              onConfirm={() => this.download(record.song_id)}
            >
              <Button>下载</Button>
            </Popconfirm>
          ) : null,
      },
    ];

    // async function DownloadFiles(paramToFiles: any) {
    //   try {
    //     var dirHandle = await window.showDirectoryPicker({
    //       startIn: 'music', //default folder
    //       writable: true, //ask for write permission
    //     }); //move script from function startDownload to here, because of an error "SecurityError: Failed to execute 'showDirectoryPicker' on 'Window': Must be handling a user gesture to show a file picker.". It was working on localhost.
    //     for (var index in paramToFiles.Files) {
    //       var file = paramToFiles.Files[index];
    //       const fileHandle = await dirHandle.getFileHandle(file.FileName, {
    //         create: true,
    //       });
    //       if (await verifyPermission(fileHandle, true)) {
    //         const writable = await fileHandle.createWritable();
    //         await writable.write(await getBlob(file.URL));
    //         await writable.close();
    //       }
    //     }
    //   } catch (error) {
    //     alert(error);
    //   }
    //   return false;
    // }

    // async function startDownload(dirHandle, paramToFiles) {
    //   //move above
    // }

    const {
      isModalOpen,
      loading,
      qualitySelect,
      emptyCount,
      playListId,
      verify,
      isNewListModalOpen,
    } = this.state;

    return (
      <div>
        <div style={{ display: 'flex' }}>
          <PinChecker onPass={() => this.setState({ verify: true })} />
          <Input.Group compact style={{ width: '400px' }}>
            <Input
              placeholder="输入歌单ID"
              style={{ width: '300px' }}
              disabled={!verify}
              onChange={(e) =>
                this.setState({ playListId: Number(e.target.value) })
              }
            />
            <Button
              type="primary"
              onClick={() => {
                this.loadPlayList(playListId);
              }}
              disabled={!verify}
            >
              导入
            </Button>
          </Input.Group>
        </div>
        <Input.Group>
          {/*<Input placeholder='保存位置' />*/}
          <Radio.Group
            value={qualitySelect}
            onChange={(e: RadioChangeEvent) =>
              this.setState({ qualitySelect: e.target.value })
            }
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
          <Button
            disabled={!verify}
            type="primary"
            onClick={() => this.setState({ isModalOpen: true })}
          >
            下载当前列表所有歌曲
          </Button>
        </Input.Group>

        <WechatQrCode />

        <Modal
          title="下载确认"
          open={isModalOpen}
          onCancel={() => this.setState({ isModalOpen: false })}
          confirmLoading={loading}
          onOk={() => {
            this.setState({ loading: true });
            this.download().then(() => this.setState({ loading: false }));
          }}
        >
          <p>当前一共有 {dataSource.length} 首歌曲，确定全部下载吗？</p>
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
          onCancel={() => this.setState({ isNewListModalOpen: false })}
          confirmLoading={loading}
          onOk={() => this.add(playListId)}
        >
          <p>歌单不存在需要导入，处理过程需要1-2小时，请勿重复提交</p>
          <p>
            服务器流量成本不菲，如果这个工具帮助到了你，你可以捐助我们，一遍我们持续运行
          </p>
        </Modal>
        <Table dataSource={dataSource} columns={columns} rowKey="id" />
      </div>
    );
  }
}
