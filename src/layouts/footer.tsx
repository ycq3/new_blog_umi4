import React from 'react';
import ReactAplayer from 'react-aplayer';
import { useModel } from 'umi';

export default function () {
  const { show, onInit } = useModel('Music');
  if (show === false) {
    return <></>;
  }
  return (
    <>
      <ReactAplayer lrcType={3} onInit={(ap: any) => onInit(ap)} />
    </>
  );
}
