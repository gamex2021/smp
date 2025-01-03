/* eslint-disable react/display-name */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/await-thenable */
interface Props {
  params: {
    domain: string
  }
}
export default async function ({ params }: Props) {
  const domain = (await params).domain
  return <div>load data for {domain}</div>
}
