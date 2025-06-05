import { useState, type FunctionComponent } from 'react'
import { ArrowDownToLineIcon, DownloadIcon, TerminalSquareIcon, Trash2Icon } from 'lucide-react'
import { Box, Divider, HStack } from 'styled-system/jsx'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { Button } from '~/components/ui/button'
import { MessageLevel, UpdateMachineContext } from '~/features/updater/useProcessUpdate'
import { format } from 'date-fns'

export const UpdateLogsCard: FunctionComponent = () => {
	const messages = UpdateMachineContext.useSelector(({ context }) => context.messages)
	const actor = UpdateMachineContext.useActorRef()
	const [isFollowingLogs, setIsFollowingLogs] = useState(true)

	const handleDownloadLogs = () => {
		const link = URL.createObjectURL(
			new Blob([messages.map((message) => `${message.timestamp}\t${message.text}`).join('\n')]),
		)
		const a = document.createElement('a')
		a.href = link
		a.download = `update_logs_${format(Date.now(), 'HH:mm:ss')}.txt`

		a.click()
		a.remove()
		URL.revokeObjectURL(link)
	}

	return (
		<Card.Root shadow="xs" maxHeight="500px" alignSelf="start">
			<Card.Header>
				<HStack gap="4">
					<TerminalSquareIcon />
					<Card.Title>Update Logs</Card.Title>
				</HStack>
				<Card.Description>Real-time firmware update logs</Card.Description>
			</Card.Header>
			<Card.Body gap="6" paddingBottom="0" overflow="auto">
				<Box fontFamily="monospace" paddingBottom="4" overflow="auto" whiteSpace="nowrap">
					{messages.map((message) => (
						<Text
							fontSize="sm"
							key={message.timestamp.toString()}
							ref={(node) => {
								if (isFollowingLogs) node?.scrollIntoView({ behavior: 'smooth' })
							}}
						>
							<Text color="fg.subtle" as="span" marginRight="4" fontSize="sm">
								{format(message.timestamp, 'HH:mm:ss')}
							</Text>
							<Text as="span" color={message.level <= MessageLevel.Error ? 'red.text' : undefined}>
								{message.text}
							</Text>
						</Text>
					))}
				</Box>
			</Card.Body>
			<Divider />
			<Card.Footer paddingTop="5" justifyContent="flex-end" gap="4">
				<Button
					variant={isFollowingLogs ? 'solid' : 'outline'}
					onClick={() => setIsFollowingLogs((prev) => !prev)}
					disabled={messages.length === 0}
					marginRight="auto"
				>
					<ArrowDownToLineIcon /> Follow logs
				</Button>
				<Button
					variant="outline"
					onClick={() => actor.send({ type: 'clearMessages' })}
					disabled={messages.length === 0}
				>
					<Trash2Icon />
					Clear logs
				</Button>
				<Button variant="outline" onClick={handleDownloadLogs} disabled={messages.length === 0}>
					<DownloadIcon /> Export logs
				</Button>
			</Card.Footer>
		</Card.Root>
	)
}
