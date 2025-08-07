export type Todo = {
  _id?: number;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  done: boolean;
}[];

export type QueryType = {
  view: boolean;
  value: string;
  result: {
    data: {
      title: string;
      done: boolean;
      dueTime: string;
      dueDate: string;
    }[];
    message: string;
  };
};
