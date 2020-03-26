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
            artistInfo: {
                artists: [],
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
    getArtistList () {
        const { keywords } = this.props;
        Taro.setNavigationBarTitle({
            title: `${keywords}的搜索结果`
        });
        const { artistInfo } = this.state;
        if (!artistInfo.more) { return; }
        $http('/search', {
            keywords,
            type: 1014,
            limit: 30,
            offset: artistInfo.artists.length
        }).then((res) => {
            this.setState({
                loading: false,
                noData: false
            });
            if (!res.result || !res.result.artistsCount) {
                this.setState({
                    noData: true
                });
                return;
            }
            if (res.result && res.result.videos) {
                this.setState({
                    artistInfo: {
                        videos: artistInfo.artists.concat(res.result.videos),
                        more: artistInfo.artists.concat(res.result.videos).length < res.result.videoCount
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
        const { artistInfo, noData, loading } = this.state;
        return (
            <View className='yl-singer'>
                {
                    loading ? <CLoading /> :
                        <ScrollView scrollY onScrollToLower={this.getArtistList.bind(this)} className='yl-singer__scroll'>
                            {
                                noData ? <View className='yl-singer__nodata'>暂无数据</View> : ''
                            }
                            {
                                artistInfo.artists.map((item) => (
                                    <View className='yl-singer__search_content__artist' key={item.id} >
                                        <Image src={item.picUrl} className='yl-singer__content__artist__cover' />
                                        <Text>{item.name}{item.alias[0] ? `（${item.alias[0]}）` : ''}</Text>
                                    </View>
                                ))
                            }
                            {artistInfo.more ? <CLoading /> : ''}
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
