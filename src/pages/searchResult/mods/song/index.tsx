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
import { formatNumber, formatCount, formatTimeStampToTime } from '@/utils/custom/common';

import { updateCanplayList, getSongInfo, updatePlayStatus } from '@/store/actions/song';
import $http from '@/utils/axios/index';
import './index.scss';


class Page extends Component {
    static defaultProps = {
        keywords: ''
    }
    constructor (props) {
        super(props);
        this.state = {
            loading: true,
            noData: true,
            playListInfo: {
                playLists: [],
                more: true,
                moreText: ''
            }
        };
    }

    componentWillMount () {
        this.getPlayList();
    }

    componentWillReceiveProps (nextProps) {
    }

    componentWillUnmount () { }

    componentDidShow () {
    }

    componentDidHide () { }


    // 获取歌单列表
    getPlayList () {
        const { keywords } = this.props;
        Taro.setNavigationBarTitle({
            title: `${keywords}的搜索结果`
        });
        const { playListInfo } = this.state;
        if (!playListInfo.more) { return; }
        $http('/search', {
            keywords,
            type: 1000,
            limit: 30,
            offset: playListInfo.playLists.length
        }).then((res) => {
            this.setState({
                loading: false,
                noData: false
            });
            if (!res.result || !res.result.playlists) {
                this.setState({
                    noData: true
                });
                return;
            }
            if (res.result && res.result.playlists) {
                this.setState({
                    playListInfo: {
                        playLists: playListInfo.playLists.concat(res.result.playlists),
                        more: playListInfo.playLists.concat(res.result.playlists).length < res.result.playlistCount
                    }
                });
            }
        });
    }
    goPlayListDetail () {

    }
    showMore () { }
    formatDuration (ms: number) {
        // @ts-ignore
        const minutes: string = formatNumber(parseInt(ms / 60000));
        // @ts-ignore
        const seconds: string = formatNumber(parseInt((ms / 1000) % 60));
        return `${minutes}:${seconds}`;
    }

    render () {
        const { activeTab } = this.props;
        console.log('Page -> render -> activeTab', activeTab);
        // eslint-disable-next-line no-shadow
        const { playListInfo, noData, loading } = this.state;
        return (
            <View className='yl-sone'>
                {
                    loading ? <CLoading /> :
                        <ScrollView scrollY onScrollToLower={this.getPlayList.bind(this)} className='yl-sone__scroll'>
                            {
                                noData ? <View className='yl-sone__nodata'>暂无数据</View> : ''
                            }
                            {
                                playListInfo.playLists.map((item) => (
                                    <View className='yl-sone__content__playList' key={item.id} onClick={this.goPlayListDetail.bind(this, item)}>
                                        <View>
                                            <Image src={item.coverImgUrl} className='yl-sone__content__playList__cover' />
                                        </View>
                                        <View className='yl-sone__content__playList__info'>
                                            <View className='yl-sone__content__playList__info__title'>
                                                {item.name}
                                            </View>
                                            <View className='yl-sone__content__playList__info__desc'>
                                                <Text>
                                                    {item.trackCount}首音乐
                                                </Text>
                                                <Text className='yl-sone__content__playList__info__desc__nickname'>
                                                    by {item.creator.nickname}
                                                </Text>
                                                <Text>
                                                    {formatCount(item.playCount)}次
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ))
                            }
                            {playListInfo.more ? <CLoading /> : ''}
                        </ScrollView>
                }
            </View>
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
