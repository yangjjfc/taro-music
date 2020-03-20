import {
  GETSONGDETAIL,
  GETPLAYLISTDETAIL,
  GETRECOMMENDPLAYLIST,
  GETRECOMMENDDJ,
  GETRECOMMENDNEWSONG,
  GETRECOMMEND,
  GETSONGINFO,
  CHANGEPLAYMODE,
  GETLIKEMUSICLIST,
  UPDATELIKEMUSICLIST,
  UPDATEPLAYSTATUS,
  UPDATECANPLAYLIST,
  UPDATERECENTTAB,
  RESETPLAYLIST
} from '../constants/song'
import $http from '@/utils/axios'
import { parse_lrc } from '@/utils/custom/common'

export const getSongDetail = (payload) => {
  return {
    type: GETSONGDETAIL,
    payload
  }
}

// 获取歌单详情
export const getPlayListDetail = (payload) => {
  const { id } = payload
  return dispatch => {
    dispatch({
      type: RESETPLAYLIST,
    })
    $http('/playlist/detail', {
      id
    }).then(res => {
      let playListDetailInfo = res.playlist
      playListDetailInfo.tracks = playListDetailInfo.tracks.map((item) => {
        let temp: any = {}
        temp.name = item.name
        temp.id = item.id
        temp.ar = item.ar
        temp.al = item.al
        temp.copyright = item.copyright
        return temp
      })
      dispatch({
        type: GETPLAYLISTDETAIL,
        payload: {
          playListDetailInfo,
          playListDetailPrivileges: res.privileges
        }
      })
    })
  }
}

// 获取推荐歌单
export const getRecommendPlayList = () => {
  return dispatch => {
    $http('/personalized').then(res => {
      let recommendPlayList = res.result
      dispatch({
        type: GETRECOMMENDPLAYLIST,
        payload: {
          recommendPlayList
        }
      })
    })
  }
}

// 获取推荐电台
export const getRecommendDj = () => {
  return dispatch => {
    $http('/personalized/djprogram').then(res => {
      let recommendDj = res.result
      dispatch({
        type: GETRECOMMENDDJ,
        payload: {
          recommendDj
        }
      })
    })
  }
}

// 获取推荐新音乐
export const getRecommendNewSong = () => {
  return dispatch => {
    $http('/personalized/newsong').then(res => {
      let recommendNewSong = res.result
      dispatch({
        type: GETRECOMMENDNEWSONG,
        payload: {
          recommendNewSong
        }
      })
    })
  }
}

// 获取推荐精彩节目
export const getRecommend = () => {
  return dispatch => {
    $http('/personalized/recommend').then(res => {
      let recommend = res.result
      dispatch({
        type: GETRECOMMEND,
        payload: {
          recommend
        }
      })
    })
  }
}

// 获取歌曲详情信息
export const getSongInfo = (payload) => {
  const { id } = payload
  return dispatch => {
    $http('/song/detail', {
      ids: id
    }).then(res => {
      let songInfo = res.songs[0]
      $http('/song/url', {
        id
      }).then(res => {
        songInfo.url = res.data[0].url
        $http('/lyric', {
          id
        }).then(res => {
          const lrc = parse_lrc(res.data.lrc && res.lrc.lyric ? res.lrc.lyric : '');
          res.lrclist = lrc.now_lrc;
          res.scroll = lrc.scroll ? 1 : 0
          songInfo.lrcInfo = res
          dispatch({
            type: GETSONGINFO,
            payload: {
              currentSongInfo: songInfo
            }
          })
        }).catch((err) => {
          console.log('获取歌词失败', err)
          dispatch({
            type: GETSONGINFO,
            payload: {
              currentSongInfo: songInfo
            }
          })
        })
      }).catch((err) => {
        console.log('获取歌曲url失败', err)
        dispatch({
          type: GETSONGINFO,
          payload: {
            currentSongInfo: songInfo
          }
        })
      })
    })
  }
}

// 切换播放模式
export const changePlayMode = (payload) => {
  return {
    type: CHANGEPLAYMODE,
    payload
  }
}

// 更新播放状态
export const updatePlayStatus = (payload) => {
  return {
    type: UPDATEPLAYSTATUS,
    payload
  }
}

// 喜欢音乐
export const likeMusic = (payload) => {
  const { like, id } = payload
  return dispatch => {
    $http('/like', {
      id,
      like
    }).then(res => {
      let changeFlag = res.code
      if (changeFlag === 200) {
        dispatch({
          type: UPDATELIKEMUSICLIST,
          payload: {
            like,
            id 
          }
        })
      }
    })
  }
}

// 获取喜欢音乐列表
export const getLikeMusicList = (payload) => {
  const { id } = payload
  return dispatch => {
    $http('/likelist', {
      uid: id
    }).then(res => {
      dispatch({
        type: GETLIKEMUSICLIST,
        payload: {
          likeMusicList: res.ids || []
        }
      })
    })
  }
}

// 更新播放列表
export const updateCanplayList = (payload) => {
  return {
    type: UPDATECANPLAYLIST,
    payload
  }
}

// 更新最近播放tab
export const updateRecentTab = (payload) => {
  return {
    type: UPDATERECENTTAB,
    payload
  }
}



