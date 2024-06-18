'use client'

import withAuth from '#hooks/withAuth'

function Test() {
  return <div>test</div>
}

export default withAuth(Test)
