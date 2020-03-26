export type InitProps = {
    activeTab: number
    keywords: string
    onSwitchTab: (object) => void
}

export type PageState = {
    loading: boolean
    noData: boolean
    albumInfo: { // 专辑
      albums: Array<{
        name: string
        id: number
        publishTime: number
        picUrl: string
        artist: {
          name: string
        }
        containedSong: string
      }>
      more: boolean
    }
}