import React, { Component } from 'react';
import { Button, Input, message } from 'antd';

interface PinCheckerProps {
  onPass: () => void;
}

interface PinCheckerState {
  verify: boolean;
  pin: number;
}

export class PinChecker extends Component<PinCheckerProps, PinCheckerState> {
  state = {
    verify: false,
    pin: 0,
  };

  componentDidMount() {
    this.setState({ pin: 427485 });

    if (process.env.NODE_ENV === 'development') {
      this.setState({ pin: 427485 });
    }
  }

  render() {
    const { verify, pin } = this.state;
    const { onPass } = this.props;
    if (verify) {
      return <></>;
    }

    return (
      <>
        <div>
          <h3>由于版权原因，不对外开放,交流请扫码关注公众号</h3>

          <Input.Group compact style={{ width: '400px' }}>
            <Input
              placeholder="输入暗号"
              style={{ width: '300px' }}
              status={'error'}
              onChange={(e) => this.setState({ pin: Number(e.target.value) })}
              disabled={verify}
              value={pin}
            />

            <Button
              type="primary"
              onClick={() => {
                if (pin === 427485) {
                  this.setState({ verify: true });
                  onPass();
                } else {
                  message.error('暗号错误');
                }
              }}
              disabled={verify}
            >
              验证
            </Button>
          </Input.Group>
        </div>
      </>
    );
  }
}
