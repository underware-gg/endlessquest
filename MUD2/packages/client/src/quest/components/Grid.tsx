import React, { ReactNode, CSSProperties } from 'react'
import {
  Row as SimpleRow,
  Col as SimpleCol,
  // @ts-ignore
} from 'react-simple-flex-grid'
import 'react-simple-flex-grid/lib/main.css'

//
// Layout based on 12 Grids System
// https://github.com/nickbullll/ReactSimpleFlexGrid
// https://ant.design/components/grid
//

interface Props {
  style?: CSSProperties,
  className?: string,
  onClick?: any | undefined,
  children: string | JSX.Element | JSX.Element[] | ReactNode
}

interface RowProps extends Props {
  span?: number,
  justify?: string,
  align?: string,
}

interface ColProps extends Props {
  span?: number,
}

//---------------------------------
// <Container>
// will center the <Grid> inside of it
//
const Container: React.FC<Props> = ({
  style = {},
  className,
  children,
}) => {
  return (
    <div
      className={className}
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  )
}


//---------------------------------
// <Grid>
// parent to <Row>
//
const Grid: React.FC<Props> = ({
  style = {},
  className,
  children,
}) => {
  return (
    <div
      className={className}
      style={{
        ...style,
        display: 'flex', // <Col> will fill height
      }}
    >
      {children}
    </div>
  )
}

const _clickableStyle = (onClick: any) => {
  return onClick ? {
    cursor: 'pointer',
    pointerEvents: 'all',
  } : {}
}

const Row: React.FC<RowProps> = ({
  span = 1,
  justify = 'center',
  align = 'middle',
  style = {},
  className = undefined,
  onClick = undefined,
  children,
}) => {
  return (
    <SimpleRow
      span={span}
      justify={justify}
      align={align}
      className={className}
      onClick={onClick}
      style={{
        ...style,
        ..._clickableStyle(onClick),
        width: '100%', // fill <Grid>
      }}
    >
      {children}
    </SimpleRow>
  )
}

const Col: React.FC<ColProps> = ({
  span = 1,
  style = {},
  className = undefined,
  onClick = undefined,
  children,
}) => {
  return (
    <SimpleCol
      span={span}
      className={className}
      onClick={onClick}
      style={{
        ...style,
        ..._clickableStyle(onClick),
        height: '100%',
      }}
    >
      {children}
    </SimpleCol>
  )
}

export {
  Container,
  Grid,
  Row,
  Col,
}
