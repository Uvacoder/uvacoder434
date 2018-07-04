import React from 'react'
import {withRouteData} from 'react-static'
import styled from 'styled-components'
import convert from 'htmr'

import Wrapper from '../components/utils/wrapper'
import DateText from '../components/utils/date-text'
import Tags from '../components/utils/tags'

const Content = styled.div`
  padding-top: 4rem;
`

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`

class ScrollToTop extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0)
  }
  render() {
    return this.props.children
  }
}

export default withRouteData(({project, tags}) => (
  <ScrollToTop>
    <Wrapper>
      <Content>
        <TitleWrapper>
          <h2>{project.title}</h2>
          <DateText alignRight date={project.date} />
        </TitleWrapper>
        <Tags tags={tags} />

        <br />
        {convert(project.contents)}
      </Content>
    </Wrapper>
  </ScrollToTop>
))
