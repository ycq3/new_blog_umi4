import React, { Component, useState } from 'react';
import { Button, Input, Table } from 'antd';
import { request } from '@@/exports';

export default function () {
  const [song, setSong] = useState('');
  const [artist, setArtist] = useState('');
  const [data, setData] = useState<Array<any>>([]);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
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

  const Search = (song: string, artist: string) => {
    setLoading(true);
    //0-6
    for (let i = 0; i < 7; i++) {
      request('/api/music/search', {
        params: {
          song: song,
          artist: artist,
          page: page,
          api: i,
        },
      }).then((resp) => {
        setData((d) => [...d, ...resp.data]);
        setLoading(false);
      });
    }
  };

  return (
    <>
      <Input
        placeholder="歌手"
        style={{ width: '300px' }}
        onChange={(e) => setArtist(String(e.target.value))}
      />
      <Input
        placeholder="歌曲名"
        style={{ width: '300px' }}
        onChange={(e) => setSong(String(e.target.value))}
      />
      <Button
        type="primary"
        onClick={() => {
          setData([]);
          Search(song, artist);
        }}
      >
        搜索
      </Button>
      <Button
        type="primary"
        onClick={() => {
          setPage((p) => p + 1);

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

export class MusicSearch extends Component<any, any> {
  state = {
    song: '',
    artist: '',
    data: [],
    page: 1,
  };

  Search(song: string, artist: string) {
    //0-6
    const { page } = this.state;
    for (let i = 0; i < 7; i++) {
      request('/api/music/search', {
        params: {
          song: song,
          artist: artist,
          page: page,
          api: i,
        },
      }).then((resp) => {
        let data = this.state.data;
        this.setState({ data: [...data, ...resp.data] });
      });
    }
  }

  render() {
    const { song, artist, data, page } = this.state;
    const loading = false;
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

    return (
      <>
        <Input
          placeholder="歌手"
          style={{ width: '300px' }}
          onChange={(e) => this.setState({ artist: String(e.target.value) })}
        />
        <Input
          placeholder="歌曲名"
          style={{ width: '300px' }}
          onChange={(e) => this.setState({ song: String(e.target.value) })}
        />
        <Button
          type="primary"
          onClick={() => {
            this.setState({ data: [] }, () => this.Search(song, artist));
          }}
        >
          搜索
        </Button>
        <Button
          type="primary"
          onClick={() => {
            this.setState({ page: page + 1 }, () => this.Search(song, artist));
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
}
