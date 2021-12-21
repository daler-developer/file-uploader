
export type FirestorePost = {
  image: {
    url: string,
    path: string,
    size: number,
    createdAt: string
  },
  likesCount: number,
  authorUid: string,
  desc: string,
  isFavourite: boolean,
}

export type FirestoreCategory = {
  name: string
}
