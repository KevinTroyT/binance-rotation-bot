const TimerJS = require('timer.js');

class Timer {
  constructor(options) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _this } = options;
    this.workTimer = new TimerJS({
      ontick: (ms) => {
        const s = ms / 1000;
        const m = Math.floor(s / 60);
        if (s.toFixed(0) % 5 === 0) {
          _this.updateAmount();
        }
        // eslint-disable-next-line eqeqeq
        if (s.toFixed(0) == 18 && m.toFixed(0) == 0) {
          _this.checkPrice();
        }
        _this.onTickHandle(ms);
      },
      onend: () => {
        if (_this.tradeQuery.length !== 0) {
          _this.tradeQuery.forEach((e) => {
            _this.client
              .newOrder(e.symbol, e.side, e.type, { quantity: e.quantity })
              .catch((err) => {
                _this.onError(err);
              });
          });
        }
        _this.timer.start(60 * 5);
      },
    });
  }

  start = (s) => {
    this.workTimer.start(s);
  };

  pause = () => {
    this.workTimer.pause();
  };

  stop = () => {
    this.workTimer.stop();
  };
}
module.exports = Timer;
