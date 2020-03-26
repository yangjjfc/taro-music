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
            videoInfo: {
                videos: [],
                more: true,
                moreText: ''
            }
        };
    }

    componentWillMount () {
        this.getVideoList();
    }

    componentWillReceiveProps (nextProps) {
    }

    componentWillUnmount () { }

    componentDidShow () {
    }

    componentDidHide () { }


    // 获取视频列表
    getVideoList () {
        const { keywords } = this.props;
        Taro.setNavigationBarTitle({
            title: `${keywords}的搜索结果`
        });
        const { videoInfo } = this.state;
        if (!videoInfo.more) { return; }
        $http('/search', {
            keywords,
            type: 1014,
            limit: 30,
            offset: videoInfo.videos.length
        }).then((res) => {
            this.setState({
                loading: false,
                noData: false
            });
            if (!res.result || !res.result.videoCount) {
                this.setState({
                    noData: true
                });
                return;
            }
            if (res.result && res.result.videos) {
                this.setState({
                    videoInfo: {
                        videos: videoInfo.videos.concat(res.result.videos),
                        more: videoInfo.videos.concat(res.result.videos).length < res.result.videoCount
                    }
                });
            }
        });
    }
    goVideoDetail () {

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
        const { videoInfo, noData, loading } = this.state;
        return (
            <View className='yl-video'>
                {
                    loading ? <CLoading /> :
                        <ScrollView scrollY onScrollToLower={this.getVideoList.bind(this)} className='yl-video__scroll'>
                            {
                                noData ? <View className='yl-video__nodata'>暂无数据</View> : ''
                            }
                            {
                                videoInfo.videos.map((item, index) => (
                                    <View className='yl-video__content__video' key={item.vid} onClick={this.goVideoDetail.bind(this, item.vid, 'video')}>
                                        <View className='yl-video__content__video__cover--wrap'>
                                            <View className='yl-video__content__video__cover--playtime'>
                                                <Text className='at-icon at-icon-play'></Text>
                                                <Text>{formatCount(item.playTime)}</Text>
                                            </View>
                                            <Image src={item.coverUrl} className='yl-video__content__video__cover' />
                                        </View>
                                        <View className='yl-video__content__video__info'>
                                            <View className='yl-video__content__video__info__title'>
                                                {item.title}
                                            </View>
                                            <View className='yl-video__content__video__info__desc'>
                                                <Text>{this.formatDuration(item.durationms)},</Text>
                                                <Text className='yl-video__content__video__info__desc__nickname'>
                                                    by {item.creator[0].userName}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ))
                            }
                            {videoInfo.more ? <CLoading /> : ''}
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
