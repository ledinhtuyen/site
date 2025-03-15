import { DocumentData } from "@google-cloud/firestore";

export interface News extends DocumentData {
  id: string;
  title: string;
  postDate: Date;
  link: string;
  createdAt: Date;
  updatedAt: Date;
}

export type NewNews = {
  title: string;
  postDate: Date;
  link: string;
};
