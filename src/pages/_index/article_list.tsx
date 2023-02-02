import { Row, List, Col } from 'antd';
import React, { Component } from 'react';
import { request } from 'umi';
import ArticleCard from './article_card';

interface Article {
  id: number;
  description: string;
  title: string;
  cover: string;
}

interface ArticleListState {
  data: Array<Article>;
  currentPage: number;
  pageSize: number;
  total: number;
}

export default class ArticleList extends Component<any, ArticleListState> {
  state = {
    data: [],
    currentPage: 1,
    pageSize: 15,
    total: 0,
  };

  componentDidMount() {
    const { currentPage } = this.state;
    this.loadArticle(currentPage);
  }

  loadArticle(page: number) {
    request('/api/article/list', {
      params: {
        page: page,
      },
    }).then((resp) => {
      const { data, total } = resp;
      this.setState({ data: data ?? [], total: total });
    });
  }

  render(): React.ReactNode {
    const { data } = this.state;
    return (
      <>
        <Row>
          <Col xs={{ offset: 1, span: 22 }} md={{ offset: 4, span: 16 }}>
            <List
              itemLayout="vertical"
              // size="large"
              pagination={{
                onChange: (page) => {
                  this.loadArticle(page);
                  // console.log(page);
                },
                pageSize: this.state.pageSize,
                total: this.state.total,
                showSizeChanger: false,
              }}
              dataSource={data}
              footer={
                <div>
                  <b>ant design</b> footer part
                </div>
              }
              renderItem={({ cover, description, id, title }) => (
                <List.Item key={id}>
                  <ArticleCard
                    description={description}
                    cover={cover}
                    title={title}
                    id={id}
                  />
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </>
    );
  }
}
