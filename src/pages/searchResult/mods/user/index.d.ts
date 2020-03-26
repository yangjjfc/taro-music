export type InitProps = {
    activeTab: number
    keywords: string
    onSwitchTab: (object) => void
}

export type PageState = {
    loading: boolean
    noData: boolean
    artistInfo: { // 歌手
      artists: Array<{
        name: string
        id: number
        picUrl: string
        alias: Array<string>
      }>
      more: boolean
      moreText: string
    }
}