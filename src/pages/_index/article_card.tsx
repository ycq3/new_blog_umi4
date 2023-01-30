import { Card, Row, Col, Space } from 'antd';
import React from 'react';
import { Link } from 'umi';
import { history } from 'umi';

import {
  LikeOutlined,
  MessageOutlined,
  EyeOutlined,
  CalendarOutlined,
} from '@ant-design/icons';

const IconText = ({
  icon,
  text,
}: {
  icon: React.FC;
  text: string | number;
}) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

interface IArticle {
  id: number;
  description: string;
  title: string;
  cover?: string;
  date: string;
  view: number;
  like: number;
  comment: number;
}

export default class ArticleCard extends React.Component<IArticle> {
  static defaultProps = {
    cover: 0,
    date: '-',
    view: 0,
    like: 0,
    comment: 0,
  };

  render(): React.ReactNode {
    const { title, description, cover, id, date, view, like, comment } =
      this.props;
    const articleUrl = `/blog/article/${id}/detail`;
    // debugger
    return (
      <>
        <Card
          title={title}
          extra={<Link to={articleUrl}>More</Link>}
          hoverable={true}
          // cover={<img src={cover}></img>}
          actions={[
            <IconText
              icon={CalendarOutlined}
              text={date}
              key="list-vertical-star-o"
            />,
            <IconText
              icon={EyeOutlined}
              text={view}
              key="list-vertical-star-o"
            />,
            <IconText
              icon={LikeOutlined}
              text={like}
              key="list-vertical-like-o"
            />,
            <IconText
              icon={MessageOutlined}
              text={comment}
              key="list-vertical-message"
            />,
          ]}
          onClick={() =>
            history.push({
              pathname: articleUrl,
            })
          }
        >
          <Row gutter={[16, 24]}>
            {cover ? (
              <>
                <Col span={6}>
                  <img style={{ width: '100%', height: 'auto' }} src={cover} />
                </Col>
              </>
            ) : (
              ''
            )}
            <Col span={cover ? 18 : 24}>
              <p> {description}</p>
            </Col>
          </Row>
        </Card>
      </>
    );
  }
}
