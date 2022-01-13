const BotControl = (superclass) =>
  class extends superclass {
    startBot = () => {
      if (this.botStatus === 0) {
        this.timer.start(5 * 60);
        // this.timer.start(25);
      } else {
        this.timer.start();
      }
      this.setBotStatus(1);
    };

    pauseBot() {
      this.timer.pause();
      this.setBotStatus(2);
    }

    stopBot() {
      this.timer.stop();
      this.setBotStatus(0);
    }
  };
module.exports = BotControl;
