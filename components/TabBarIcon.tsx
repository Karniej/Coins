import { Ionicons } from '@expo/vector-icons'
import * as React from 'react'
import colors from '../constants/colors'

type Props = {
  name: string
  focused: boolean
}

export default function TabBarIcon(props: Props) {
  return (
    <Ionicons
      name={props.name}
      size={30}
      style={{ marginBottom: -3 }}
      color={props.focused ? colors.tabIconSelected : colors.tabIconDefault}
    />
  )
}
