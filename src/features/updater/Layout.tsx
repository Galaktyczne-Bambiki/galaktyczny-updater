import { useDarkMode } from 'usehooks-ts'
import { Box } from 'styled-system/jsx'
import { useLayoutEffect, useState } from 'react'
import { Text } from '~/components/ui/text'
import { BeerIcon, XIcon } from 'lucide-react'
import { FirmwareUpload } from '~/features/updater/FirmwareUpload'
import { DeviceStatusCard } from '~/features/updater/DeviceStatusCard'
import { UpdateProgressCard } from '~/features/updater/UpdateProgressCard'
import { UpdateLogsCard } from '~/features/updater/UpdateLogsCard'
import { IconButton } from '~/components/ui/icon-button'
import { useProcessUpdate } from '~/features/updater/useProcessUpdate'
import { Toast } from '~/components/ui/toast'
import { toaster } from '~/lib/toaster'
import { ReadyState } from 'react-use-websocket'
import { Tooltip } from '~/components/ui/tooltip'
import logo from '~/assets/deer_circuit.png'

export const Layout = () => {
	const { isDarkMode } = useDarkMode()
	const [isBeerMode, setIsBeerMode] = useState(false)

	const websocketState = useProcessUpdate()

	useLayoutEffect(() => {
		document.documentElement.dataset.theme = isDarkMode ? 'dark' : 'light'
	}, [isDarkMode])

	return (
		<Box backgroundColor="bg.canvas" display="flex" flexDirection="column" flex="1" height="screen" width="screen">
			<Box
				display="flex"
				backgroundColor="bg.default"
				borderBottom="1px solid"
				borderColor="border.subtle"
				paddingBlock="4"
				paddingInline="6"
				gap="4"
				alignItems="center"
			>
				<Box
					display="flex"
					width="12"
					aspectRatio="1"
					borderRadius="md"
					backgroundColor="colorPalette.default"
					color="colorPalette.fg"
					padding="2"
					alignItems="center"
				>
					<img src={logo} />
				</Box>
				<Box display="flex" flexDirection="column">
					<Text textStyle="lg" color="fg.default" fontWeight="600">
						Galaktyczny Updater
					</Text>
					<Text textStyle="sm" color="fg.subtle" fontWeight="400" fontStyle="italic">
						Updates firmware like no one else
					</Text>
				</Box>
				<Tooltip.Root openDelay={0}>
					<Tooltip.Trigger asChild>
						<IconButton
							variant={isBeerMode ? 'solid' : 'subtle'}
							onClick={() => setIsBeerMode((prev) => !prev)}
							marginLeft="auto"
						>
							<BeerIcon />
						</IconButton>
					</Tooltip.Trigger>
					<Tooltip.Positioner>
						<Tooltip.Arrow>
							<Tooltip.ArrowTip />
						</Tooltip.Arrow>
						<Tooltip.Content>Toggle beer mode</Tooltip.Content>
					</Tooltip.Positioner>
				</Tooltip.Root>
			</Box>
			<Box flex="1" paddingInline="6" paddingBlock="6" display="flex" justifyContent="center" alignItems="flex-start">
				<Box
					display="grid"
					md={{ gridTemplateColumns: 'minmax(auto, 500px) minmax(auto, 800px)' }}
					gridTemplateColumns="1fr"
					gap="4"
					maxWidth="2000px"
				>
					<FirmwareUpload isConnected={websocketState === ReadyState.OPEN} />
					<DeviceStatusCard websocketState={websocketState} />
					<UpdateProgressCard isBeerMode={isBeerMode} />
					<UpdateLogsCard />
				</Box>
			</Box>
			<Toast.Toaster toaster={toaster}>
				{(toast) => (
					<Toast.Root
						key={toast.id}
						css={{
							'&[data-type="error"]': {
								color: 'red.fg',
								backgroundColor: 'red.default',
							},
						}}
					>
						<Toast.Title
							css={{
								'[data-type="error"] &': {
									color: 'red.fg',
								},
							}}
						>
							{toast.title}
						</Toast.Title>
						<Toast.Description
							css={{
								'[data-type="error"] &': {
									color: 'red.fg',
								},
							}}
						>
							{toast.description}
						</Toast.Description>
						<Toast.CloseTrigger asChild>
							<IconButton size="sm" variant="link">
								<XIcon />
							</IconButton>
						</Toast.CloseTrigger>
					</Toast.Root>
				)}
			</Toast.Toaster>
		</Box>
	)
}
