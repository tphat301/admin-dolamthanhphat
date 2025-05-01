import { Card, CardContent } from '../../components/ui/card'
import { ChartContainer, type ChartConfig } from '../../components/ui/chart'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'

const Dashboard = () => {
  const chartData = [
    { month: 'Thang 1', desktop: 186, mobile: 80 },
    { month: 'Thang 2', desktop: 305, mobile: 200 },
    { month: 'Thang 3', desktop: 237, mobile: 120 },
    { month: 'Thang 4', desktop: 73, mobile: 190 },
    { month: 'Thang 5', desktop: 209, mobile: 130 },
    { month: 'Thang 6', desktop: 214, mobile: 140 },
    { month: 'Thang 7', desktop: 214, mobile: 240 },
    { month: 'Thang 8', desktop: 214, mobile: 40 },
    { month: 'Thang 9', desktop: 214, mobile: 20 },
    { month: 'Thang 10', desktop: 214, mobile: 40 },
    { month: 'Thang 11', desktop: 214, mobile: 10 },
    { month: 'Thang 12', desktop: 214, mobile: 90 }
  ]
  const chartConfig = {
    desktop: {
      label: 'Desktop',
      color: '#2563eb'
    },
    mobile: {
      label: 'Mobile',
      color: '#60a5fa'
    }
  } satisfies ChartConfig
  return (
    <div className='w-[calc(100%-20px)] mx-auto'>
      <Card className='w-full mx-auto mt-10 p-0'>
        <CardContent className='p-0'>
          <h2 className='text-lg font-semibold mb-2 p-3 border-b border-gray-300'>Dashboard</h2>
          <ChartContainer config={chartConfig} className='w-full h-[300px] p-3'>
            <BarChart accessibilityLayer data={chartData}>
              <XAxis dataKey='month' />
              <YAxis />
              <Bar dataKey='desktop' fill='var(--color-desktop)' radius={4} />
              <Bar dataKey='mobile' fill='var(--color-mobile)' radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
