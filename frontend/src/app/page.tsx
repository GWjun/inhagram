'use client'

import withAuth from '#hooks/withAuth'

function Page() {
  return <div>Main Page</div>
}

export default withAuth(Page)
