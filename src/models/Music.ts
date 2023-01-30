import { useState } from 'react';
import { Song } from '@/pages/Music';

export default () => {
  const [player, setPlayer] = useState(null);
  const [show, showPlayer] = useState(false);
  const [tmpSong, setTmpSong] = useState<Song | null>(null);

  const addPlayList = (s: Song) => {
    showPlayer(true);
    if (player === null) {
      setTmpSong(s);
      return;
    }
    for (let i in player.list.audios) {
      if (player.list.audios[i].id === s.id) {
        player.list.switch(i);
        return;
      }
    }

    // let isFind = player.list.audios.find((i) => s.id === i.id);
    player.list.add({
      id: s.id,
      name: s.name,
      artist: s.artist,
      url: '/api/song/' + s.id + '/' + 4 + '/download.cache',
      cover: '/api/song/' + s.id + '/cover/download.cache',
      lrc: '/api/song/' + s.id + '/lrc/download.cache',
    });
    player.list.switch(player.list.audios.length - 1);
  };

  const onInit = (ap: any) => {
    setPlayer(ap);
    if (tmpSong !== null) {
      addPlayList(tmpSong);
    }
  };

  return { show, showPlayer, addPlayList, onInit };
};

// const Music ={
//    state:{
//       show:false
//    }
// }
//
// export default Music;
