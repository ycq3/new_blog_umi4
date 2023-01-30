import { HomeOutlined } from '@ant-design/icons';
function MusicPage() {
  return (
    <div>
      <h1>Page MusicPage</h1>
    </div>
  );
}

MusicPage.menu = {
  name: '网盘', // 兼容此写法
  icon: <HomeOutlined />,
};

export default MusicPage;
