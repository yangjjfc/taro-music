export type InitProps = {
    activeTab: number
    keywords: string
    onSwitchTab: (object) => void
}

export type PageState = {
    loading: boolean
    noData: boolean
    playListInfo: { // 歌单
        playLists: Array<{
          name: string
          id: number
          coverImgUrl: string
          trackCount: number
          playCount: number
          creator: {
            nickname: string
          }
        }>
        more: boolean
        moreText?: string
      }
}