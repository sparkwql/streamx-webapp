export interface AlertSetting {
  id: string;
  userId: string;
  alertName: string;
  alertType: number;
  emailParams: string;
  dingTalkParams: string;
  weComParams: string;
  httpCallbackParams?: any;
  larkParams: string;
  createTime: string;
  modifyTime: string;
}
