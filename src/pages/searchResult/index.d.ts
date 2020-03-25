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
    totalInfo: {
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
            moreText?: string
        }
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
        userListInfo: { // 用户
            users: Array<{
                nickname: string
                userId: number
                avatarUrl: string
                gender: number
                signature: string
            }>
            more: boolean
            moreText: string
        }
        djRadioInfo: { // 电台
            djRadios: Array<{
                name: string
                id: number
                picUrl: string
                desc: string
            }>
            more: boolean
            moreText: string
        }
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
            moreText: string
        }
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
        sim_query: {
            sim_querys: Array<{
                keyword: string
            }>
            more: boolean
        }
    }
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
    artistInfo: { // 歌手
        artists: Array<{
            name: string
            id: number
            picUrl: string
            alias: Array<string>
        }>
        more: boolean
    }
    djRadioInfo: { // 电台
        djRadios: Array<{
            name: string
            id: number
            picUrl: string
            desc: string
        }>
        more: boolean
    }
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
    }
    mvInfo: { // 视频
        mvs: Array<{
            name: string
            id: string
            cover: string
            artists: Array<{
                name: string
            }>
            duration: number
            playCount: number
        }>
        more: boolean
    }
    userListInfo: { // 用户
        users: Array<{
            nickname: string
            userId: number
            avatarUrl: string
            gender: number
            signature: string
        }>
        more: boolean
    }
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
    sim_query: Array<{
        keyword: string
    }>
}