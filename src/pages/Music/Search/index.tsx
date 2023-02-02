import React, { useState } from 'react';
import { Button, Checkbox, Input, Table } from 'antd';
import { request } from '@@/exports';

export default function () {
  const [song, setSong] = useState('');
  const [artist, setArtist] = useState('周杰伦');
  const [data, setData] = useState<Array<any>>([]);

  const [loading, setLoading] = useState(false);
  const [fullMatchArtist, setFullMatchArtist] = useState(true);
  const [fullMatchSong, setFullMatchSong] = useState(false);
  const columns = [
    {
      title: '歌曲ID',
      dataIndex: 'id',
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
  ];
  let cacheData = new Array<any>();
  let page = 1;

  const Search = (song: string, artist: string) => {
    setLoading(true);
    let pageT = page; //由于函数会耗时，避免请求过程中加载下一页点击导致数据错乱
    let funcArr = [];
    //0-6
    for (let i = 0; i < 7; i++) {
      funcArr.push(
        (async function (): Promise<Array<any>> {
          try {
            let r = await request('/api/music/search', {
              params: {
                song: song,
                artist: artist,
                page: pageT,
                api: i,
              },
            });
            if (r.data !== undefined) {
              return r.data;
            }
            return [];
          } catch (e) {
            return [];
          }
        })(),
      );
    }

    Promise.all(funcArr).then((rets) => {
      let tmp = new Array<any>();
      rets.forEach((ret) => {
        tmp.push(...ret);
      });
      setLoading(false);
      setData(() => {
        return [...cacheData, ...tmp];
      });
    });
  };

  return (
    <>
      <div>
        <Input
          placeholder="歌手"
          style={{ width: '300px' }}
          defaultValue={artist}
          onChange={(e) => setArtist(String(e.target.value))}
        />
        <Checkbox
          checked={fullMatchArtist}
          onChange={(e) => {
            setFullMatchArtist(e.target.checked);
          }}
        >
          完全匹配
        </Checkbox>
      </div>

      <div>
        <Input
          placeholder="歌曲名"
          style={{ width: '300px' }}
          onChange={(e) => setSong(String(e.target.value))}
        />

        <Checkbox
          checked={fullMatchSong}
          onChange={(e) => {
            setFullMatchSong(e.target.checked);
          }}
        >
          完全匹配
        </Checkbox>
      </div>

      <Button
        type="primary"
        onClick={() => {
          cacheData = [];
          Search(song, artist);
        }}
      >
        搜索
      </Button>
      <Button
        type="primary"
        onClick={() => {
          page++;
          Search(song, artist);
        }}
      >
        加载更多
      </Button>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        loading={loading}
      />
    </>
  );
}
