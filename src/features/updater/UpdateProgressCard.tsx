import { Fragment, type FunctionComponent } from 'react'
import { AlertCircleIcon, AlertTriangleIcon, CheckCircle2Icon, CircleAlertIcon, InfoIcon } from 'lucide-react'
import { HStack, VStack } from 'styled-system/jsx'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { Progress } from '~/components/ui/progress'
import { Alert } from '~/components/ui/alert'
import { css } from 'styled-system/css'
import { Spinner } from '~/components/ui/spinner'
import { UpdateMachineContext } from '~/features/updater/useProcessUpdate'
import { BeerProgress } from '~/components/BeerProgress'

type UpdateProgressCardProps = {
	isBeerMode: boolean
}

export const UpdateProgressCard: FunctionComponent<UpdateProgressCardProps> = ({ isBeerMode }) => {
	const currentState = UpdateMachineContext.useSelector(({ value }) => value)
	const { percentage, steps, totalSteps } = UpdateMachineContext.useSelector(
		({ context: { percentage, steps, totalSteps } }) => ({
			percentage,
			steps,
			totalSteps,
		}),
	)

	return (
		<Card.Root shadow="xs" alignSelf="start">
			<Card.Header>
				<Card.Title>Update Progress</Card.Title>
				<Card.Description>Firmware update status and progress</Card.Description>
			</Card.Header>
			<Card.Body gap="6">
				{currentState === 'idle' ? (
					<Alert.Root backgroundColor="colorPalette.default/20" borderColor="colorPalette.default/40">
						<Alert.Icon asChild>
							<InfoIcon />
						</Alert.Icon>
						<Alert.Content>
							<Alert.Title>Waiting</Alert.Title>
							<Alert.Description>Waiting for update to start. You will see progress of update here</Alert.Description>
						</Alert.Content>
					</Alert.Root>
				) : currentState === 'failure' ? (
					<Alert.Root backgroundColor="red.default/20" borderColor="red.default/40">
						<Alert.Icon asChild>
							<AlertCircleIcon />
						</Alert.Icon>
						<Alert.Content>
							<Alert.Title>Update failed</Alert.Title>
							<Alert.Description>There was an error during update. You are doomed 💀</Alert.Description>
						</Alert.Content>
					</Alert.Root>
				) : currentState === 'success' ? (
					<Alert.Root backgroundColor="grass.default/20" borderColor="grass.default/40">
						<Alert.Icon asChild>
							<CheckCircle2Icon />
						</Alert.Icon>
						<Alert.Content>
							<Alert.Title>Update finished</Alert.Title>
							<Alert.Description>Update finished sucessfully. Wait for the device to restart</Alert.Description>
						</Alert.Content>
					</Alert.Root>
				) : (
					<Alert.Root backgroundColor="amber.default/20" borderColor="amber.default/40">
						<Alert.Icon asChild>
							<AlertTriangleIcon />
						</Alert.Icon>
						<Alert.Content>
							<Alert.Title>Update in progress</Alert.Title>
							<Alert.Description>Updating may take a few minutes, please don't turn off the power</Alert.Description>
						</Alert.Content>
					</Alert.Root>
				)}
				{totalSteps > 0 && currentState !== 'idle' && (
					<Fragment>
						{isBeerMode ? (
							<BeerProgress progress={percentage} />
						) : (
							<VStack gap="2">
								<HStack justifyContent="space-between" width="full">
									<Text textStyle="xs">
										Step {steps.at(-1)?.number} of {totalSteps}
									</Text>
									<Text textStyle="xs">{percentage}%</Text>
								</HStack>
								<Progress value={percentage} />
							</VStack>
						)}
						<VStack gap="6" alignItems="flex-start">
							{steps.map((step, index) => (
								<HStack justifyContent="space-between" width="100%">
									<VStack gap="1" alignItems="flex-start">
										<Text textStyle="xs" fontWeight="600">
											Step #{step.number}
										</Text>
										<Text textStyle="xs" color="fg.subtle">
											{step.name}
										</Text>
									</VStack>
									{index + 1 === steps.length && currentState === 'failure' ? (
										// Last step that failed
										<CircleAlertIcon className={css({ color: 'red.default' })} />
									) : index + 1 === steps.length && currentState === 'success' ? (
										// Last step when success
										<CheckCircle2Icon className={css({ color: 'green' })} />
									) : index + 1 === steps.length && currentState === 'updating' ? (
										// Last step when still updating
										<Spinner />
									) : (
										// Not last field
										<CheckCircle2Icon className={css({ color: 'green' })} />
									)}
								</HStack>
							))}
						</VStack>
					</Fragment>
				)}
			</Card.Body>
		</Card.Root>
	)
}
