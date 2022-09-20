import { onMounted, ref } from 'vue';
import { getTeamListByUser } from '/@/api/sys/team';

export const useFlinkApplication = () => {
  const users = ref<Recordable>([]);
  const optionApps = {
    starting: new Map(),
    stopping: new Map(),
    launch: new Map(),
  };

  function handleCheckLaunchApp(item) {
    console.log(item);
  }
  function handleAppCheckStart(item) {
    console.log(item);
  }
  function handleCancel(item) {
    console.log(item);
  }
  function handleSeeLog(item) {
    console.log(item);
  }
  function handleCanStop(app) {
    const optionTime = new Date(app['optionTime']).getTime();
    const nowTime = new Date().getTime();
    if (nowTime - optionTime >= 60 * 1000) {
      const state = app['optionState'];
      if (state === 0) {
        return app.state === 3 || app.state === 4 || app.state === 8 || false;
      }
      return true;
    }
    return false;
  }
  function handleForcedStop(item) {
    console.log(item);
  }
  function handleCopy(item) {
    console.log(33, item);
  }
  function handleMapping(item) {
    console.log(item);
  }

  function handleIsStart(app) {
    /**
     * FAILED(7),
     * CANCELED(9),
     * FINISHED(10),
     * SUSPENDED(11),
     * LOST(13),
     * OTHER(15),
     * REVOKED(16),
     * TERMINATED(18),
     * POS_TERMINATED(19),
     * SUCCEEDED(20),
     * KILLED(-9)
     * @type {boolean}
     */
    const status = [0, 7, 9, 10, 11, 13, 16, 18, 19, 20, -9].includes(app.state);

    /**
     *
     * // 部署失败
     * FAILED(-1),
     * // 完结
     * DONE(0),
     * // 任务修改完毕需要重新发布
     * NEED_LAUNCH(1),
     * // 上线中
     * LAUNCHING(2),
     * // 上线完毕,需要重启
     * NEED_RESTART(3),
     * //需要回滚
     * NEED_ROLLBACK(4),
     * // 项目发生变化,任务需检查(是否需要重新选择jar)
     * NEED_CHECK(5),
     * // 发布的任务已经撤销
     * REVOKED(10);
     */

    const launch = [0, 3].includes(app.launch);

    const optionState = !optionApps.starting.get(app.id) || app['optionState'] === 0 || false;

    return status && launch && optionState;
  }

  onMounted(async () => {
    const res = await getTeamListByUser({ pageSize: '9999' });
    users.value = res.records;
    // this.handleFetch(true);
    // const timer = window.setInterval(() => {
    //   this.handleDashboard();
    //   this.handleFetch(false);
    // }, this.queryInterval);
    // this.$once('hook:beforeDestroy', () => {
    //   clearInterval(timer);
    //   clearInterval(this.appBuildDtlReqTimer);
    // });
    // handleResize();
  });

  return {
    handleCheckLaunchApp,
    handleAppCheckStart,
    handleCancel,
    handleSeeLog,
    handleCanStop,
    handleForcedStop,
    handleCopy,
    handleMapping,

    handleIsStart,
    users,
  };
};
