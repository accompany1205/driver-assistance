import React, { useState, useRef } from 'react'

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from 'react-image-crop'
import { canvasPreview } from './canvasPreview'
import { useDebounceEffect } from './useDebounceEffect'

import 'react-image-crop/dist/ReactCrop.css'
import { relative } from 'path'
import { SeverityPill } from '../severity-pill';
import { Button, Stack } from "@mui/material";
import { blob } from 'stream/consumers'
import { useEffect } from 'preact/hooks'

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export function UploadAvatar(props: any) {
  const {photoURL, callback} = props;
  const [imgSrc, setImgSrc] = useState(photoURL.split('/')[photoURL.split('/').length-1] == 'null'? '/static/mock-images/user.png': photoURL);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const fileButtonRef = useRef<HTMLInputElement>(null)

  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const [aspect, setAspect] = useState<undefined>()
  const [showBtn, setShowBtn] = useState<boolean>(false);

  const [file, setFile] = useState<File>();

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined) // Makes crop preview update between images.
      callback(e.target.files[0]);
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || ''),
      )
      reader.readAsDataURL(e.target.files[0])
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspect))
    }
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        ).then((res)=>{
          if(res){
            const source = res;
            const newImageFile = new File([res],'avatar.jpeg', {type:"image/jpeg", lastModified:new Date().getTime()})
            setFile(newImageFile);
            callback(newImageFile);
          }  
        })
      }
    },
    100,
    [completedCrop]
  )

 

  const toggleShowBtn = (event:any, value: boolean):void => {
    setShowBtn(value);
  }

  const handleChangeBtn = (event: any):void =>{
    fileButtonRef.current?.click();
  }
  const handleCancelBtn = (event: any): void => {
    setImgSrc(photoURL.split('/')[photoURL.split('/').length-1] == 'null'? '/static/mock-images/user.png': photoURL);
  }


  return (
    <div>
      <div className="Crop-Controls">
        <input ref={fileButtonRef} style={{display: 'none'}} type="file" accept="image/*" onChange={onSelectFile} />
        
      </div>
      {photoURL !== imgSrc && (
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => {
            percentCrop.height=percentCrop.width;
            setCrop(percentCrop)
          } }
          onComplete={(c) =>{
            setCompletedCrop(c)
          } }
          // aspect={aspect}
          style={{borderRadius:'50%'}}
        >
          <img
            ref={imgRef}
            alt="Crop me"
            src={imgSrc}
            style={{ 
              transform: `scale(${scale}) rotate(${rotate}deg)`, 
              borderRadius:'50%',
              width:'15vw',
              minWidth:150,
              height:'15vw',
              minHeight:150,
            }}
            onLoad={onImageLoad}
            onMouseEnter={(event)=>toggleShowBtn(event,true)}
            onMouseLeave={(event)=>toggleShowBtn(event,false)}
          />
        </ReactCrop>
      )}
      {photoURL == imgSrc &&
        <img
          ref={imgRef}
          alt="Crop me"
          src={imgSrc}
          style={{ 
            transform: `scale(${scale}) rotate(${rotate}deg)`, 
            borderRadius:'50%',
            width:'15vw',
            minWidth:150,
            height:'15vw',
            minHeight:150,
          }}
          onLoad={onImageLoad}
          onMouseEnter={(event)=>toggleShowBtn(event,true)}
          onMouseLeave={(event)=>toggleShowBtn(event,false)}
        />  
      }
      
      <Stack direction='row' justifyContent="center" sx={{mt:3}}>
        {!!completedCrop && (
          <canvas
            ref={previewCanvasRef}
            style={{
              border: '1px solid black',
              objectFit: 'contain',
              width: completedCrop.width,
              height: completedCrop.height,
              display:'none'
            }}
          />
        )}
          <Button color={'success'}  onClick={handleChangeBtn}> change </Button>
          <Button color={'primary'}  onClick={handleCancelBtn}> cancel </Button>
      </Stack>
      
    </div>
  )
}
