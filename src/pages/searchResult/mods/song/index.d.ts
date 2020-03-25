export type InitProps = {
    activeTab: number
    keywords: string
    onSwitchTab: (object) => void
}

export type PageState = {
    loading: boolean
    noData: boolean
    songInfo: { // 单曲
        songs: Array<{
            id: number
            name: string
            al: {
                id: number
                name: string
            }
            ar: Array<{
                name: string
            }>
        }>
        more: boolean
    }
}