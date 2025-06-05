import { useState, type FunctionComponent } from 'react'
import { RefreshCwIcon, XIcon } from 'lucide-react'
import { Box, Circle, Divider, HStack, Stack, VStack } from 'styled-system/jsx'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { IconButton } from '~/components/ui/icon-button'
import { Text } from '~/components/ui/text'
import { Dialog } from '~/components/ui/dialog'
import { Spinner } from '~/components/ui/spinner'
import { toaster } from '~/lib/toaster'
import { ReadyState } from 'react-use-websocket'
import ky from 'ky'

type DeviceStatusCardProps = {
	websocketState: ReadyState
}

export const DeviceStatusCard: FunctionComponent<DeviceStatusCardProps> = ({ websocketState }) => {
	const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false)
	const [isRestarting, setIsRestarting] = useState(false)

	const handleRestart = async () => {
		try {
			setIsConfirmationDialogOpen(false)
			setIsRestarting(true)
			await ky.post('restart')
		} catch (error) {
			toaster.create({
				title: 'Error',
				description: error instanceof Error ? error.message : 'There was an error',
				type: 'error',
				duration: Number.POSITIVE_INFINITY,
			})
		} finally {
			setIsRestarting(false)
		}
	}

	return (
		<Card.Root shadow="xs">
			<Card.Header>
				<Card.Title>Device Status</Card.Title>
				<Card.Description>Current device information</Card.Description>
			</Card.Header>
			<Card.Body gap="6">
				<Box display="grid" gridTemplateColumns="1fr 1fr" gap="10">
					<VStack alignItems="flex-start" gap="1">
						<Text textStyle="sm" fontWeight="600">
							Device model
						</Text>
						<Text textStyle="sm" fontWeight="400" color="fg.muted">
							ESP32-DevKitC
						</Text>
					</VStack>
					<VStack alignItems="flex-start" gap="1">
						<Text textStyle="sm" fontWeight="600">
							Current version
						</Text>
						<Text textStyle="sm" fontWeight="400" color="fg.muted">
							v0.0.0
						</Text>
					</VStack>
					<VStack alignItems="flex-start" gap="1">
						<Text textStyle="sm" fontWeight="600">
							Connection
						</Text>
						{websocketState === ReadyState.OPEN ? (
							<HStack alignItems="center">
								<Circle width="8px" height="8px" backgroundColor="green" />
								<Text textStyle="sm" fontWeight="400" color="fg.muted">
									Connected
								</Text>
							</HStack>
						) : websocketState === ReadyState.CONNECTING ? (
							<HStack alignItems="center">
								<Spinner size="xs" />
								<Text textStyle="sm" fontWeight="400" color="fg.muted">
									Connecting...
								</Text>
							</HStack>
						) : (
							<HStack alignItems="center">
								<Circle width="8px" height="8px" backgroundColor="red.default" />
								<Text textStyle="sm" fontWeight="400" color="fg.muted">
									Disconnected
								</Text>
							</HStack>
						)}
					</VStack>
				</Box>
				<Divider />
				<Dialog.Root open={isConfirmationDialogOpen} onOpenChange={({ open }) => setIsConfirmationDialogOpen(open)}>
					<Dialog.Trigger asChild>
						<Button variant="outline" loading={isRestarting}>
							<RefreshCwIcon /> Restart system
						</Button>
					</Dialog.Trigger>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content>
							<Stack gap="8" p="6">
								<Stack gap="1">
									<Dialog.Title>Restart system</Dialog.Title>
									<Dialog.Description>Are you sure you want to restart system?</Dialog.Description>
								</Stack>
								<Stack gap="3" direction="row" width="full">
									<Dialog.CloseTrigger asChild>
										<Button variant="outline" flex="1">
											Cancel
										</Button>
									</Dialog.CloseTrigger>
									<Button flex="1" onClick={handleRestart}>
										Restart
									</Button>
								</Stack>
							</Stack>
							<Dialog.CloseTrigger asChild position="absolute" top="2" right="2">
								<IconButton aria-label="Close Dialog" variant="ghost" size="sm">
									<XIcon />
								</IconButton>
							</Dialog.CloseTrigger>
						</Dialog.Content>
					</Dialog.Positioner>
				</Dialog.Root>
			</Card.Body>
		</Card.Root>
	)
}
