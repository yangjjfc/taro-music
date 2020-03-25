import { ComponentClass } from 'react';
import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text, ScrollView } from '@tarojs/components';
import { AtTabsPane, AtIcon } from 'taro-ui';
import classnames from 'classnames';
import CLoading from '@/components/CLoading';
import { connect } from '@tarojs/redux';
import CMusic from '@/components/CMusic';
import { PageState, InitProps } from './index.d';
import { getStorageSync, setStorageSync, deepClone } from '@/utils/custom/global';
import { formatNumber } from '@/utils/custom/common';

import { updateCanplayList, getSongInfo, updatePlayStatus } from '@/store/actions/song';
import $http from '@/utils/axios/index';
import './index.scss';

const totalInfo: PageState['totalInfo'] = {
    userListInfo: {
        users: [],
        more: false,
        moreText: ''
    },
    videoInfo: {
        videos: [],
        more: false,
        moreText: ''
    },
    playListInfo: {
        playLists: [],
        more: false,
        moreText: ''
    },
    songInfo: {
        songs: [],
        more: false,
        moreText: ''
    },
    albumInfo: {
        albums: [],
        more: false,
        moreText: ''
    },
    djRadioInfo: {
        djRadios: [],
        more: false,
        moreText: ''
    },
    artistInfo: {
        artists: [],
        more: false,
        moreText: ''
    },
    sim_query: {
        sim_querys: [],
        more: false
    }
};


class Page extends Component {
    static defaultProps = {
        keywords: ''
    }
    constructor (props) {
        super(props);
        this.state = {
            loading: true,
            noData: false,
            totalInfo: deepClone(totalInfo)
        };
    }

    componentWillMount () {
        this.getResult();
    }

    componentWillReceiveProps (nextProps) {
    }

    componentWillUnmount () { }

    componentDidShow () {
    }

    componentDidHide () { }


    getResult () {
        const { keywords } = this.props;
        Taro.setNavigationBarTitle({
            title: `${keywords}的搜索结果`
        });
        this.setState({
            loading: true
        });
        $http('/search', {
            keywords,
            type: 1018
        }).then((res) => {
            this.setState({
                loading: false
            });
            if (!res.result) {
                this.setState({
                    noData: true
                });
                return;
            }
            const result = res.result;
            this.setState({
                totalInfo: {
                    albumInfo: result.album || {
                        albums: []
                    },
                    artistInfo: result.artist || {
                        artists: []
                    },
                    djRadioInfo: result.djRadio || {
                        djRadios: []
                    },
                    playListInfo: result.playList || {
                        playLists: []
                    },
                    songInfo: result.song || {
                        songs: []
                    },
                    userListInfo: result.user || {
                        users: []
                    },
                    videoInfo: result.video || {
                        videos: []
                    },
                    sim_query: result.sim_query || {
                        sim_querys: []
                    }
                }
            });
        });
    }


    playSong (songId) {
        $http('/check/music', {
            id: songId
        }).then((res) => {
            if (res.success) {
                Taro.navigateTo({
                    url: `/pages/songDetail/index?id=${songId}`
                });
            } else {
                Taro.showToast({
                    title: res.data.message,
                    icon: 'none'
                });
            }
        });
    }
    showMore () {
        Taro.showToast({
            title: '暂未实现，敬请期待',
            icon: 'none'
        });
    }

    goPlayListDetail (item) {
        Taro.navigateTo({
            url: `/pages/playListDetail/index?id=${item.id}&name=${item.name}`
        });
    }

    goVideoDetail (id, type) {
        let apiUrl = '/video/url';
        if (type === 'mv') {
            apiUrl = '/mv/url';
        }
        $http(apiUrl, {
            id
        }).then(({ data }) => {
            console.log('data', data);
            if ((type === 'video' && data.urls && data.urls.length) || (type === 'mv' && data.data.url)) {
                Taro.navigateTo({
                    url: `/pages/videoDetail/index?id=${id}&type=${type}`
                });
            } else {
                Taro.showToast({
                    title: `该${type === 'mv' ? 'mv' : '视频'}暂无版权播放`,
                    icon: 'none'
                });
            }
        });

    }

    queryResultBySim (keyword) {
        // setKeywordInHistory(keyword)
        // this.setState({
        //   keywords: keyword
        // }, () => {
        //   // this.getResult()
        // })
    }


    formatDuration (ms: number) {
        // @ts-ignore
        const minutes: string = formatNumber(parseInt(ms / 60000));
        // @ts-ignore
        const seconds: string = formatNumber(parseInt((ms / 1000) % 60));
        return `${minutes}:${seconds}`;
    }

    render () {
        const { activeTab, onSwitchTab } = this.props;
        const { totalInfo, loading, noData } = this.state;
        return (
            <AtTabsPane current={activeTab} index={0} className='yl-synthesize'>
                {
                    loading ? <CLoading /> :
                        <ScrollView scrollY className='yl-synthesize__scroll'>
                            {
                                noData ? <View className='yl-synthesize__nodata'>暂无数据</View> : ''
                            }
                            {
                                totalInfo.songInfo.songs.length ?
                                    <View className='yl-synthesize__content'>
                                        <View className='yl-synthesize__content__title'>
                                            单曲
                                        </View>
                                        {
                                            totalInfo.songInfo.songs.map((item) => (
                                                <View key={item.id} className='searchResult__music'>
                                                    <View className='searchResult__music__info' onClick={this.playSong.bind(this, item.id)}>
                                                        <View className='searchResult__music__info__name'>
                                                            {item.name}
                                                        </View>
                                                        <View className='searchResult__music__info__desc'>
                                                            {`${item.ar[0] ? item.ar[0].name : ''} - ${item.al.name}`}
                                                        </View>
                                                    </View>
                                                    <View className='fa fa-ellipsis-v searchResult__music__icon' onClick={this.showMore.bind(this)}></View>
                                                </View>
                                            ))
                                        }
                                        {
                                            totalInfo.songInfo.moreText ? <View className='search_content__more' onClick={onSwitchTab.bind(this, 1)}>
                                                {totalInfo.songInfo.moreText}<AtIcon value='chevron-right' size='16' color='#ccc'></AtIcon>
                                            </View> : ''
                                        }
                                    </View> : ''
                            }
                            {
                                totalInfo.playListInfo.playLists.length ?
                                    <View>
                                        <View className='search_content__title'>
                                            歌单
                                        </View>
                                        <View>
                                            {
                                                totalInfo.playListInfo.playLists.map((item, index) => (
                                                    <View className='search_content__playList__item' key={item.id} onClick={this.goPlayListDetail.bind(this, item)}>
                                                        <View>
                                                            <Image src={item.coverImgUrl} className='search_content__playList__item__cover' />
                                                        </View>
                                                        <View className='search_content__playList__item__info'>
                                                            <View className='search_content__playList__item__info__title'>
                                                                {item.name}
                                                            </View>
                                                            <View className='search_content__playList__item__info__desc'>
                                                                <Text>
                                                                    {item.trackCount}首音乐
                                                                </Text>
                                                                <Text className='search_content__playList__item__info__desc__nickname'>
                                                                    by {item.creator.nickname}
                                                                </Text>
                                                                <Text>
                                                                    {/* {formatCount(item.playCount)}次 */}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                ))
                                            }
                                            {
                                                totalInfo.playListInfo.moreText ? <View className='search_content__more' onClick={onSwitchTab.bind(this, 2)}>
                                                    {totalInfo.playListInfo.moreText}<AtIcon value='chevron-right' size='16' color='#ccc'></AtIcon>
                                                </View> : ''
                                            }
                                        </View>
                                    </View> : ''
                            }
                            {
                                totalInfo.videoInfo.videos.length ?
                                    <View>
                                        <View className='search_content__title'>
                                            视频
                                        </View>
                                        <View>
                                            {
                                                totalInfo.videoInfo.videos.map((item) => (
                                                    <View className='search_content__video__item' key={item.vid} onClick={this.goVideoDetail.bind(this, item.vid, 'video')}>
                                                        <View className='search_content__video__item__cover--wrap'>
                                                            <View className='search_content__video__item__cover--playtime'>
                                                                <Text className='at-icon at-icon-play'></Text>
                                                                {/* <Text>{formatCount(item.playTime)}</Text> */}
                                                            </View>
                                                            <Image src={item.coverUrl} className='search_content__video__item__cover' />
                                                        </View>
                                                        <View className='search_content__video__item__info'>
                                                            <View className='search_content__video__item__info__title'>
                                                                {item.title}
                                                            </View>
                                                            <View className='search_content__video__item__info__desc'>
                                                                <Text>{this.formatDuration(item.durationms)},</Text>
                                                                <Text className='search_content__video__item__info__desc__nickname'>
                                                                    by {item.creator[0].userName}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                ))
                                            }
                                            {
                                                totalInfo.videoInfo.moreText ? <View className='search_content__more' onClick={onSwitchTab.bind(this, 3)}>
                                                    {totalInfo.videoInfo.moreText}<AtIcon value='chevron-right' size='16' color='#ccc'></AtIcon>
                                                </View> : ''
                                            }
                                        </View>
                                    </View> : ''
                            }

                            {
                                totalInfo.sim_query.sim_querys.length ? <View>
                                    <View className='search_content__title'>
                                        相关搜索
                                    </View>
                                    <View className='search_content__simquery'>
                                        {
                                            totalInfo.sim_query.sim_querys.map((item) => <Text key={item.keyword} onClick={this.queryResultBySim.bind(this, item.keyword)} className='search_content__simquery__item'>{item.keyword}</Text>)
                                        }
                                    </View>
                                </View> : ''
                            }
                            {
                                totalInfo.artistInfo.artists.length ?
                                    <View>
                                        <View className='search_content__title'>
                                            歌手
                                        </View>
                                        <View>
                                            {
                                                totalInfo.artistInfo.artists.map((item) => (
                                                    <View className='search_content__artist__item' key={item.id} onClick={this.showMore.bind(this)}>
                                                        <Image src={item.picUrl} className='search_content__artist__item__cover' />
                                                        <Text>{item.name}{item.alias[0] ? `（${item.alias[0]}）` : ''}</Text>
                                                    </View>
                                                ))
                                            }
                                            {
                                                totalInfo.artistInfo.moreText ? <View className='search_content__more' onClick={onSwitchTab.bind(this, 4)}>
                                                    {totalInfo.artistInfo.moreText}<AtIcon value='chevron-right' size='16' color='#ccc'></AtIcon>
                                                </View> : ''
                                            }
                                        </View>
                                    </View> : ''
                            }
                            {
                                totalInfo.albumInfo.albums.length ?
                                    <View>
                                        <View className='search_content__title'>
                                            专辑
                                        </View>
                                        <View>
                                            {
                                                totalInfo.albumInfo.albums.map((item) => (
                                                    <View className='search_content__playList__item' key={item.id} onClick={this.showMore.bind(this)}>
                                                        <View>
                                                            <Image src={item.picUrl} className='search_content__playList__item__cover' />
                                                        </View>
                                                        <View className='search_content__playList__item__info'>
                                                            <View className='search_content__playList__item__info__title'>
                                                                {item.name}
                                                            </View>
                                                            <View className='search_content__playList__item__info__desc'>
                                                                <Text>
                                                                    {item.artist.name}
                                                                </Text>
                                                                <Text className='search_content__playList__item__info__desc__nickname'>
                                                                    {
                                                                        // item.containedSong ? `包含单曲：${item.containedSong}` : formatTimeStampToTime(item.publishTime)
                                                                    }
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                ))
                                            }
                                            {
                                                totalInfo.albumInfo.moreText ? <View className='search_content__more' onClick={onSwitchTab.bind(this, 5)}>
                                                    {totalInfo.albumInfo.moreText}<AtIcon value='chevron-right' size='16' color='#ccc'></AtIcon>
                                                </View> : ''
                                            }
                                        </View>
                                    </View> : ''
                            }
                            {
                                totalInfo.djRadioInfo.djRadios.length ?
                                    <View>
                                        <View className='search_content__title'>
                                            电台
                                        </View>
                                        <View>
                                            {
                                                totalInfo.djRadioInfo.djRadios.map((item) => (
                                                    <View className='search_content__playList__item' key={item.id} onClick={this.showMore.bind(this)}>
                                                        <View>
                                                            <Image src={item.picUrl} className='search_content__playList__item__cover' />
                                                        </View>
                                                        <View className='search_content__playList__item__info'>
                                                            <View className='search_content__playList__item__info__title'>
                                                                {item.name}
                                                            </View>
                                                            <View className='search_content__playList__item__info__desc'>
                                                                <Text>
                                                                    {item.desc}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                ))
                                            }
                                            {
                                                totalInfo.djRadioInfo.moreText ? <View className='search_content__more' onClick={onSwitchTab.bind(this, 6)}>
                                                    {totalInfo.djRadioInfo.moreText}<AtIcon value='chevron-right' size='16' color='#ccc'></AtIcon>
                                                </View> : ''
                                            }
                                        </View>
                                    </View> : ''
                            }
                            {
                                totalInfo.userListInfo.users.length ?
                                    <View>
                                        <View className='search_content__title'>
                                            用户
                                        </View>
                                        <View>
                                            {
                                                totalInfo.userListInfo.users.map((item) => (
                                                    <View className='search_content__artist__item' key={item.userId} onClick={this.showMore.bind(this)}>
                                                        <Image src={item.avatarUrl} className='search_content__artist__item__cover' />
                                                        <View className='search_content__artist__item__info'>
                                                            <View>
                                                                {item.nickname}
                                                                {
                                                                    item.gender === 1 ? <AtIcon prefixClass='fa' value='mars' size='12' color='#5cb8e7'></AtIcon> : ''
                                                                }
                                                                {
                                                                    item.gender === 2 ? <AtIcon prefixClass='fa' value='venus' size='12' color='#f88fb8'></AtIcon> : ''
                                                                }
                                                            </View>
                                                            {
                                                                item.signature ?
                                                                    <View className='search_content__artist__item__desc'>
                                                                        {item.signature}
                                                                    </View> : ''
                                                            }
                                                        </View>
                                                    </View>
                                                ))
                                            }
                                            {
                                                totalInfo.userListInfo.moreText ? <View className='search_content__more' onClick={onSwitchTab.bind(this, 7)}>
                                                    {totalInfo.userListInfo.moreText}<AtIcon value='chevron-right' size='16' color='#ccc'></AtIcon>
                                                </View> : ''
                                            }
                                        </View>
                                    </View> : ''
                            }
                        </ScrollView>
                }
            </AtTabsPane>
        );
    }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

interface Page {
    props: InitProps
    state: PageState
}

export default Page as ComponentClass<InitProps, PageState>;
