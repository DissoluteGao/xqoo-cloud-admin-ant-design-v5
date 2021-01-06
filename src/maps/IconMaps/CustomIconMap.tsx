import React from "react";
import {
  SmileOutlined,
  HeartOutlined,
  VerticalAlignTopOutlined,
  CrownOutlined,
  SettingOutlined,
  PlusSquareOutlined,
  PlusSquareFilled,
  PlusSquareTwoTone,
  StepBackwardOutlined,
  StepForwardOutlined,
  DownCircleTwoTone,
  UpCircleTwoTone,
  FastBackwardOutlined,
  FastForwardOutlined,
  ShrinkOutlined,
  ArrowsAltOutlined,
  DownOutlined,
  UpOutlined,
  VerticalAlignMiddleOutlined,
  VerticalAlignBottomOutlined,
  RollbackOutlined,
  EnterOutlined,
  RetweetOutlined,
  PlayCircleOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BorderBottomOutlined,
  BorderHorizontalOutlined,
  BorderInnerOutlined,
  BorderOuterOutlined,
  BorderLeftOutlined,
  BorderRightOutlined,
  BorderTopOutlined,
  BorderVerticleOutlined,
  PicCenterOutlined,
  PicLeftOutlined,
  PicRightOutlined,
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
  RadiusUpleftOutlined,
  RadiusUprightOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  QuestionOutlined,
  QuestionCircleOutlined,
  PlusOutlined,
  PlusCircleOutlined,
  PauseOutlined,
  PauseCircleOutlined,
  MinusOutlined,
  MinusCircleOutlined,
  MinusSquareOutlined,
  InfoOutlined,
  InfoCircleOutlined,
  ExclamationOutlined,
  ExclamationCircleOutlined,
  CloseOutlined,
  CloseCircleOutlined,
  CloseSquareOutlined,
  CheckOutlined,
  CheckCircleOutlined,
  CheckSquareOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  IssuesCloseOutlined,
  StopOutlined,
  FundProjectionScreenOutlined,
  CodeOutlined
} from "@ant-design/icons";

export const IconModule = {
  iconType: [
    {
      label: '线框风格',
      value: 'Outlined',
      icon: <PlusSquareOutlined />,
    },
    {
      label: '实底风格',
      value: 'Filled',
      icon: <PlusSquareFilled />
    },
    {
      label: '双色风格',
      value: 'TwoTone',
      icon: <PlusSquareTwoTone />
    }
  ],
  iconTypeClassify: {
    Outlined: [
      {
        label: '方向性图标',
        value: 'position',
        mapping: [
          'StepBackwardOutlined',
          'StepForwardOutlined',
          'FastBackwardOutlined',
          'FastForwardOutlined',
          'ShrinkOutlined',
          'ArrowsAltOutlined',
          'DownOutlined',
          'UpOutlined',
          'VerticalAlignMiddleOutlined',
          'VerticalAlignBottomOutlined',
          'RollbackOutlined',
          'EnterOutlined',
          'RetweetOutlined',
          'PlayCircleOutlined',
          'LoginOutlined',
          'LogoutOutlined',
          'MenuFoldOutlined',
          'MenuUnfoldOutlined',
          'BorderBottomOutlined',
          'BorderHorizontalOutlined',
          'BorderInnerOutlined',
          'BorderOuterOutlined',
          'BorderLeftOutlined',
          'BorderRightOutlined',
          'BorderTopOutlined',
          'BorderVerticleOutlined',
          'PicCenterOutlined',
          'PicLeftOutlined',
          'PicRightOutlined',
          'RadiusBottomleftOutlined',
          'RadiusBottomrightOutlined',
          'RadiusUpleftOutlined',
          'RadiusUprightOutlined',
          'FullscreenOutlined',
          'FullscreenExitOutlined'
        ]
      },
      {
        label: '提议性图标',
        value: 'suggest',
        mapping: [
          'QuestionOutlined',
          'QuestionCircleOutlined',
          'PlusOutlined',
          'PlusCircleOutlined',
          'PauseOutlined',
          'PauseCircleOutlined',
          'MinusOutlined',
          'MinusCircleOutlined',
          'MinusSquareOutlined',
          'InfoOutlined',
          'InfoCircleOutlined',
          'ExclamationOutlined',
          'ExclamationCircleOutlined',
          'CloseOutlined',
          'CloseCircleOutlined',
          'CloseSquareOutlined',
          'CheckOutlined',
          'CheckCircleOutlined',
          'CheckSquareOutlined',
          'ClockCircleOutlined',
          'WarningOutlined',
          'IssuesCloseOutlined',
          'StopOutlined',
        ]
      },
      {
        label: '编辑类图标',
        value: 'edit',
        mapping: []
      },
      {
        label: '数据类图标',
        value: 'data',
        mapping: []
      },
      {
        label: '品牌和应用图标',
        value: 'logo',
        mapping: []
      },
      {
        label: '网站通用图标',
        value: 'website',
        mapping: [
          'SmileOutlined',
          'FundProjectionScreenOutlined',
          'CodeOutlined'
        ]
      }
    ],
    Filled: [
      {
        label: '方向性图标',
        value: 'position',
        mapping: []
      },
      {
        label: '提议性图标',
        value: 'suggest',
        mapping: []
      },
      {
        label: '编辑类图标',
        value: 'edit',
        mapping: []
      },
      {
        label: '数据类图标',
        value: 'data',
        mapping: []
      },
      {
        label: '品牌和应用图标',
        value: 'logo',
        mapping: []
      },
      {
        label: '网站通用图标',
        value: 'website',
        mapping: []
      }
    ],
    TwoTone: [
      {
        label: '方向性图标',
        value: 'position',
        mapping: ['UpCircleTwoTone', 'DownCircleTwoTone']
      },
      {
        label: '提议性图标',
        value: 'suggest',
        mapping: []
      },
      {
        label: '编辑类图标',
        value: 'edit',
        mapping: []
      },
      {
        label: '数据类图标',
        value: 'data',
        mapping: []
      },
      {
        label: '品牌和应用图标',
        value: 'logo',
        mapping: []
      },
      {
        label: '网站通用图标',
        value: 'website',
        mapping: []
      }
    ],
  }
};

export const CustomIconMap = {
  SmileOutlined: <SmileOutlined />,
  HeartOutlined: <HeartOutlined />,
  VerticalAlignTopOutlined: <VerticalAlignTopOutlined />,
  CrownOutlined: <CrownOutlined />,
  SettingOutlined: <SettingOutlined />,
  PlusSquareOutlined: <PlusSquareOutlined />,
  StepBackwardOutlined: <StepBackwardOutlined />,
  StepForwardOutlined: <StepForwardOutlined />,
  FastBackwardOutlined: <FastBackwardOutlined />,
  FastForwardOutlined: <FastForwardOutlined />,
  ShrinkOutlined: <ShrinkOutlined />,
  ArrowsAltOutlined: <ArrowsAltOutlined />,
  DownOutlined: <DownOutlined />,
  UpOutlined: <UpOutlined />,
  VerticalAlignMiddleOutlined: <VerticalAlignMiddleOutlined />,
  VerticalAlignBottomOutlined: <VerticalAlignBottomOutlined />,
  RollbackOutlined: <RollbackOutlined />,
  EnterOutlined: <EnterOutlined />,
  RetweetOutlined: <RetweetOutlined />,
  PlayCircleOutlined: <PlayCircleOutlined />,
  LoginOutlined: <LoginOutlined />,
  LogoutOutlined: <LogoutOutlined />,
  MenuFoldOutlined: <MenuFoldOutlined />,
  MenuUnfoldOutlined: <MenuUnfoldOutlined />,
  BorderBottomOutlined: <BorderBottomOutlined />,
  BorderHorizontalOutlined: <BorderHorizontalOutlined />,
  BorderInnerOutlined: <BorderInnerOutlined />,
  BorderOuterOutlined: <BorderOuterOutlined />,
  BorderLeftOutlined: <BorderLeftOutlined />,
  BorderRightOutlined: <BorderRightOutlined />,
  BorderTopOutlined: <BorderTopOutlined />,
  BorderVerticleOutlined: <BorderVerticleOutlined />,
  PicCenterOutlined: <PicCenterOutlined />,
  PicLeftOutlined: <PicLeftOutlined />,
  PicRightOutlined: <PicRightOutlined />,
  RadiusBottomleftOutlined: <RadiusBottomleftOutlined />,
  RadiusBottomrightOutlined: <RadiusBottomrightOutlined />,
  RadiusUpleftOutlined: <RadiusUpleftOutlined />,
  RadiusUprightOutlined: <RadiusUprightOutlined />,
  FullscreenOutlined: <FullscreenOutlined />,
  FullscreenExitOutlined: <FullscreenExitOutlined />,
  QuestionOutlined: <QuestionOutlined />,
  QuestionCircleOutlined: <QuestionCircleOutlined />,
  PlusOutlined: <PlusOutlined />,
  PlusCircleOutlined: <PlusCircleOutlined />,
  PauseOutlined: <PauseOutlined />,
  PauseCircleOutlined: <PauseCircleOutlined />,
  MinusOutlined: <MinusOutlined />,
  MinusCircleOutlined: <MinusCircleOutlined />,
  MinusSquareOutlined: <MinusSquareOutlined />,
  InfoOutlined: <InfoOutlined />,
  InfoCircleOutlined: <InfoCircleOutlined />,
  ExclamationOutlined: <ExclamationOutlined />,
  ExclamationCircleOutlined: <ExclamationCircleOutlined />,
  CloseOutlined: <CloseOutlined />,
  CloseCircleOutlined: <CloseCircleOutlined />,
  CloseSquareOutlined: <CloseSquareOutlined />,
  CheckOutlined: <CheckOutlined />,
  CheckCircleOutlined: <CheckCircleOutlined />,
  CheckSquareOutlined: <CheckSquareOutlined />,
  ClockCircleOutlined: <ClockCircleOutlined />,
  WarningOutlined: <WarningOutlined />,
  IssuesCloseOutlined: <IssuesCloseOutlined />,
  StopOutlined: <StopOutlined />,
  FundProjectionScreenOutlined: <FundProjectionScreenOutlined />,
  CodeOutlined: <CodeOutlined />,

  PlusSquareFilled: <PlusSquareFilled />,


  PlusSquareTwoTone: <PlusSquareTwoTone />,
  UpCircleTwoTone: <UpCircleTwoTone />,
  DownCircleTwoTone: <DownCircleTwoTone />,
};
