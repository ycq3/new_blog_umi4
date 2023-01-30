import { HomeOutlined } from '@ant-design/icons';
import { Button, Input, Table, Modal, Form, Image, Checkbox } from 'antd';
import React, { Component } from 'react';
import { request } from 'umi';

// import {JolPlayer} from "jol-player";
import { JolPlayer, videoType } from 'jol-player';

// import { FileSystemGetFileOptions } from 'wicg-file-system-access';

interface VideoUrl {
  name: string;
  url: string;
}

interface Index {
  index: string;
  actor: string;
  area: string;
  name: string;
  content: string;
  director: string;
  play_url: Array<VideoUrl>;
  time: string;
  year: string;
  pic: string;
  num: number;
}

interface MovieState {
  data: Array<Index>;
  currentPage: number;
  pageSize: number;
  total: number;
  name: string;
  isModalOpen: boolean;
  isMailModalOpen: boolean;
  loading: boolean;
  qualitySelect: number;
  emptyCount: number;
  pin: number;
  isNewListModalOpen: boolean;
  currentPlay: Index;
  videoUrl: string;
  apiIndex: number;
  emailIsValid: boolean;
  fullMatch: boolean;
}

export default class MoviePage extends Component<any, MovieState> {
  public static menu = {
    name: '电影', // 兼容此写法
    icon: <HomeOutlined />,
  };

  private dirHandle: FileSystemDirectoryHandle | undefined;

  state = {
    data: Array<Index>(),
    currentPage: 1,
    pageSize: 15,
    total: 0,
    name: '',
    isModalOpen: false,
    loading: false,
    qualitySelect: 1,
    emptyCount: 0,
    pin: 0,
    isNewListModalOpen: false,
    currentPlay: { name: '', play_url: [] as Array<VideoUrl> } as Index,
    videoUrl: '',
    isMailModalOpen: false,
    apiIndex: 0,
    emailIsValid: false,
    fullMatch: false,
  };

  componentDidMount() {
    if (process.env.NODE_ENV === 'development') {
      this.setState({ pin: 427485, name: '狂飙', fullMatch: true });
    }
    this.loadMovieList();
  }

  play(id: string) {
    const { data } = this.state;

    let currentPlay = data.find((i) => i.index === id) ?? null;

    if (currentPlay !== null) {
      this.setState({
        currentPlay: currentPlay,
        isModalOpen: true,
        videoUrl: currentPlay.play_url.at(0)?.url ?? '',
      });
    }
    // let player = ;
  }

  add(email: string) {
    const { pin } = this.state;
    request('/api/movie/subscribe/add', {
      params: {
        email: email,
        key: pin,
      },
    }).then((resp) => {
      console.log(resp);
      this.setState({ isNewListModalOpen: false });
    });
  }

  loadMovieList() {
    let { data, name, apiIndex, fullMatch } = this.state;

    if (name.length === 0) {
      return;
    }

    this.setState({ loading: true });
    // const { currentPage, pageSize } = this.state;
    request('/api/movie/search/', {
      params: {
        q: name,
        api: apiIndex,
        full_match: fullMatch,
      },
    })
      .then((resp) => {
        let respData = resp.data.map((item: Index, i: number) => {
          item.index = apiIndex + '-' + i;
          item.num = item.play_url.length;
          return item;
        });
        this.setState({ data: [...data, ...respData], loading: false });
      })
      .catch(() => this.setState({ loading: false }));

    // request('/api/songs/play_list/' + name, {
    //   params: {
    //     page: currentPage,
    //     pageSize: pageSize,
    //   },
    // }).then((resp) => {
    //   const { data, total } = resp;
    //   let emptyCount = 0;
    //   data.map((i: Index) => {
    //     const qualityText = ['FLAC', 'm4a', '320K', '128K', 'ERROR'];
    //     i.qualityText = qualityText[i.quality - 1] ?? 'ERROR';
    //     if (i.quality > 4) {
    //       emptyCount++;
    //     }
    //     return i;
    //   });
    //
    //   this.setState({
    //     data: data,
    //     total: total,
    //     loading: false,
    //     emptyCount: emptyCount,
    //     isNewListModalOpen: data.length == 0,
    //   });
    // });
  }

  loadMore() {
    const { apiIndex } = this.state;
    this.setState(
      {
        apiIndex: apiIndex + 1,
      },
      this.loadMovieList,
    );
  }

  // async download() {
  //   if (this.dirHandle == null) {
  //     console.log('no permission');
  //     this.dirHandle = await window.showDirectoryPicker({
  //       startIn: 'music', //default folder
  //       writable: true, //ask for write permission
  //     });
  //     await this.download();
  //   }
  //
  //   const { data } = this.state;
  //   // this.dirHandle
  //
  //   for (const i of data) {
  //     if (i.quality < 5) {
  //       await this.getBlob(i);
  //     }
  //   }
  // }

  // async getBlob(s: Index) {
  //   const urlToGet = 'api/song/' + s.id + '/' + s.quality;
  //   const data = await fetch(urlToGet);
  //   if (data.status != 200) {
  //     s.status = '服务器错误:' + data.statusText;
  //     return;
  //   }
  //
  //   const ext: string | null = data.headers.get('FileExt');
  //   if (ext == null) {
  //     return;
  //   }
  //
  //   // return data.blob();
  //
  //   const filename = (s.name + '-' + s.artist + ext).replaceAll(
  //     /[\\\\/:*?\"<>|]/g,
  //     '',
  //   );
  //   // console.log(filename);
  //   s.status = '开始下载' + filename;
  //
  //   const fileHandle = await this.dirHandle?.getFileHandle(filename, {
  //     create: true,
  //   });
  //
  //   if (fileHandle == null) {
  //     console.error('get file handle' + fileHandle);
  //     return;
  //   }
  //
  //   console.log(fileHandle);
  //
  //   if (await this.verifyPermission(fileHandle, true)) {
  //     const writable = await fileHandle.createWritable();
  //     await writable.write(await data.blob());
  //     await writable.close();
  //     s.status = '下载完成';
  //   }
  // }

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

  renderButton(currentPlay: Index | undefined) {
    const { videoUrl } = this.state;
    if (currentPlay === undefined) {
      return <></>;
    }

    // @ts-ignore
    let button = currentPlay.play_url.map((item, i) => (
      <Button
        type={videoUrl === item.url ? 'primary' : 'default'}
        key={i}
        onClick={() => {
          this.setState({ videoUrl: item.url });
        }}
      >
        {item.name}
      </Button>
    ));
    return <>{button}</>;
  }

  render(): React.ReactNode {
    const {
      data: dataSource,
      isModalOpen,
      videoUrl,
      loading,
      name,
      currentPlay,
      isMailModalOpen,
      emailIsValid,
      fullMatch,
    } = this.state;

    const columns = [
      {
        title: '图片',
        dataIndex: 'pic',
        render: (text: string) => {
          return <Image src={text} height={'auto'} width={'100px'} />;
        },
      },
      {
        title: '片名',
        dataIndex: 'name',
      },
      {
        title: '导演',
        dataIndex: 'director',
      },
      {
        title: '演员',
        dataIndex: 'actor',
      },
      {
        title: '地区',
        dataIndex: 'area',
      },
      {
        title: '语言',
        dataIndex: 'lang',
      },
      {
        title: '年份',
        dataIndex: 'year',
      },
      {
        title: '更新时间',
        dataIndex: 'time',
      },
      {
        title: '集数',
        dataIndex: 'num',
      },
      {
        title: '播放',
        dataIndex: 'index',
        render: (id: string) => {
          return (
            <>
              <Button onClick={() => this.play(id)}>播放</Button>
              <Button>缓存到本地</Button>
            </>
          );
        },
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

    let videoType: videoType = videoUrl.endsWith('m3u8') ? 'hls' : 'h264';

    return (
      <div>
        <div>
          <Input.Group>
            <Input
              placeholder="输入片名"
              style={{ width: '300px' }}
              onChange={(e) => this.setState({ name: String(e.target.value) })}
              value={name}
            />
            <Button
              type="primary"
              onClick={() => {
                this.setState({ data: [] }, this.loadMovieList);
              }}
              disabled={name.length === 0}
            >
              搜索
            </Button>
            <Checkbox
              checked={fullMatch}
              onChange={(e) => {
                this.setState({ fullMatch: e.target.checked });
              }}
            >
              完全匹配
            </Checkbox>
          </Input.Group>
        </div>
        {/*<Input.Group>*/}
        {/*  /!*<Input placeholder='保存位置' />*!/*/}
        {/*  <Radio.Group*/}
        {/*    value={qualitySelect}*/}
        {/*    onChange={(e: RadioChangeEvent) =>*/}
        {/*      this.setState({ qualitySelect: e.target.value })*/}
        {/*    }*/}
        {/*  >*/}
        {/*    <Radio value={1}>优先下载最高品质</Radio>*/}
        {/*    <Radio value={2} disabled={true}>*/}
        {/*      优先下载最低品质*/}
        {/*    </Radio>*/}
        {/*    <Radio value={3} disabled={true}>*/}
        {/*      全部下载*/}
        {/*    </Radio>*/}
        {/*  </Radio.Group>*/}
        {/*  <Checkbox disabled={true}>同时下载歌词</Checkbox>*/}
        {/*  <Checkbox disabled={true}>同时下载封面</Checkbox>*/}
        <Button
          type="primary"
          onClick={() => this.setState({ isMailModalOpen: true })}
        >
          邮件订阅
        </Button>
        {/*</Input.Group>*/}

        <Modal
          title={currentPlay?.name}
          open={isModalOpen}
          onCancel={() => this.setState({ isModalOpen: false })}
          footer={null}
          width={750 + 24 * 2}
          destroyOnClose={true}
        >
          <div>视频采集自互联网，请勿相信视频中的广告！</div>
          <JolPlayer
            style={{ marginTop: 30, marginBottom: 10 }}
            option={{
              videoSrc: videoUrl,
              width: 750,
              height: 420,
              videoType: videoType,
            }}
          />
          {this.renderButton(currentPlay)}
        </Modal>
        <Modal
          title="邮件订阅"
          open={isMailModalOpen}
          onCancel={() => this.setState({ isMailModalOpen: false })}
          confirmLoading={loading}
          onOk={() => this.add('')}
        >
          <p>
            系统将每天 00:00
            进行全网搜索，如果有符合条件的资源，将给指定的邮箱发送一封提心邮件，以便在有资源的时候通知你
          </p>
          <p>
            服务器流量成本不菲，如果这个工具帮助到了你，你可以捐助我们，以便我们持续运行
          </p>

          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            // initialValues={{ remember: true }}
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
            onFieldsChange={(changedFields) => {
              let mailField = changedFields.find((i) => i.name === 'email');
              if (mailField !== undefined) {
                if (mailField.value.length > 0) {
                  this.setState({
                    emailIsValid: mailField.errors?.length === 0,
                  });
                } else {
                  this.setState({
                    emailIsValid: false,
                  });
                }
              }
            }}
          >
            <Form.Item label="邮箱" name="email" rules={[{ type: 'email' }]}>
              <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" disabled={!emailIsValid}>
                查看已有订阅
              </Button>
            </Form.Item>
            <p>下面内容非必填，建议在收到错误的资源时填写</p>
            <Form.Item label="片名" name="name">
              <Input />
            </Form.Item>
            <Form.Item label="导演" name="director">
              <Input />
            </Form.Item>
            <Form.Item
              label="演员"
              name="actor"
              tooltip="填写一个即可，建议填写主演"
            >
              <Input />
            </Form.Item>
            <Form.Item label="地区" name="area">
              <Input />
            </Form.Item>
            <Form.Item label="语言" name="lang">
              <Input />
            </Form.Item>

            <Form.Item label="年份" name="year">
              <Input />
            </Form.Item>
          </Form>
        </Modal>
        <Table
          dataSource={dataSource}
          columns={columns}
          key={'index'}
          pagination={false}
          loading={loading}
        />
        <Button onClick={() => this.loadMore()}>加载更多</Button>
      </div>
    );
  }
}
