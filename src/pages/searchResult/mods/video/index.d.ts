export type InitProps = {
    activeTab: number
    keywords: string
    onSwitchTab: (object) => void
}

export type PageState = {
    loading: boolean
    noData: boolean
    videoInfo: { // 视频
      videos: Array<{
        title: string
        vid: string
        coverUrl: string
        creator: Array<{
          userName: string
        }>
        durationms: number
        playTime: number
      }>
      more: boolean
      moreText: string
    }
}