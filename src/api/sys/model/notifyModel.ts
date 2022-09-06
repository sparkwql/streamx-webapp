export interface NoticyList {
  records: NoticyItem[];
  total: string;
}
export interface NoticyItem {
  id: string;
  title: string;
  createTime: string;
  context: string;
}
