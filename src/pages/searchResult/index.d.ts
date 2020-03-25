/* eslint-disable @typescript-eslint/no-explicit-any */
import { songType } from '@/store/constants/commonType';

export type PageStateProps = {
    song: songType
}

export type PageDispatchProps = {
    updateCanplayList: (object) => any
    getSongInfo: (object) => any
    updatePlayStatus: (object) => any
}

export type IProps = PageStateProps & PageDispatchProps

export type PageState = {
    keywords: string
    activeTab?: number
    show: boolean
}