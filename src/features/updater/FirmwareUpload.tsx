import { useState, type FunctionComponent } from 'react'
import { FileBoxIcon, Trash2Icon, UploadIcon } from 'lucide-react'
import { Fragment } from 'react/jsx-runtime'
import { HStack, VStack } from 'styled-system/jsx'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { FileUpload } from '~/components/ui/file-upload'
import { IconButton } from '~/components/ui/icon-button'
import { Text } from '~/components/ui/text'
import { css } from 'styled-system/css'
import ky from 'ky'
import { toaster } from '~/lib/toaster'
import { Tooltip } from '~/components/ui/tooltip'
import { Progress } from '~/components/ui/progress'

type FirmwareUploadProps = {
	isConnected: boolean
}

export const FirmwareUpload: FunctionComponent<FirmwareUploadProps> = ({ isConnected }) => {
	const [percentage, setPercentage] = useState<number>()

	const handleStart = async (file?: File) => {
		if (!file) return

		try {
			const body = new FormData()
			body.set('file', file)

			const promise = ky.post('upload', {
				body,
				// onUploadProgress: (progress) => setPercentage(Math.round(progress.percent * 100)),
			})
			setPercentage(0)
			await promise
			setPercentage(100)
		} catch (error) {
			toaster.create({
				title: 'Error',
				description: error instanceof Error ? error.message : 'There was an error',
				type: 'error',
				duration: Number.POSITIVE_INFINITY,
			})
		}
	}

	return (
		<Card.Root shadow="xs">
			<Card.Header>
				<HStack gap="4">
					<UploadIcon />
					<Card.Title>Upload Firmware</Card.Title>
				</HStack>
				<Card.Description>Upload your firmware file to begin the update process</Card.Description>
			</Card.Header>
			<Card.Body>
				<FileUpload.Root maxFiles={1} accept=".swu">
					<FileUpload.Context>
						{({ acceptedFiles }) => (
							<Fragment>
								{acceptedFiles.length === 0 ? (
									<FileUpload.Dropzone gap="6">
										<FileBoxIcon width="32px" height="32px" className={css({ color: 'colorPalette.text' })} />
										<VStack gap="1">
											<FileUpload.Label fontWeight="600" fontSize="md">
												Drop firmware file here
											</FileUpload.Label>
											<Text fontSize="sm" color="fg.muted">
												or click to browse
											</Text>
										</VStack>
										<FileUpload.Trigger asChild>
											<Button size="sm">Browse Files</Button>
										</FileUpload.Trigger>
									</FileUpload.Dropzone>
								) : (
									<VStack gap="6">
										<FileUpload.ItemGroup width="full">
											{acceptedFiles.map((file, id) => (
												<FileUpload.Item key={id} file={file}>
													<FileUpload.ItemName />
													<FileUpload.ItemSizeText />
													<FileUpload.ItemDeleteTrigger asChild>
														<IconButton variant="link" size="sm">
															<Trash2Icon />
														</IconButton>
													</FileUpload.ItemDeleteTrigger>
												</FileUpload.Item>
											))}
										</FileUpload.ItemGroup>
										<Tooltip.Root openDelay={0} disabled={isConnected}>
											<Tooltip.Trigger asChild>
												<Button
													width="full"
													onClick={() => handleStart(acceptedFiles.at(0))}
													disabled={!isConnected || percentage !== undefined}
												>
													Start!
												</Button>
											</Tooltip.Trigger>
											<Tooltip.Positioner>
												<Tooltip.Arrow>
													<Tooltip.ArrowTip />
												</Tooltip.Arrow>
												<Tooltip.Content>Waiting for connection to device</Tooltip.Content>
											</Tooltip.Positioner>
										</Tooltip.Root>
										{percentage !== undefined && (
											<VStack gap="2" width="full">
												<HStack justifyContent="space-between" width="full">
													<Text textStyle="xs">{percentage === 100 ? 'Upload completed!' : 'Uploading...'}</Text>
													<Text textStyle="xs">{percentage}%</Text>
												</HStack>
												<Progress value={percentage} />
											</VStack>
										)}
									</VStack>
								)}
								<FileUpload.HiddenInput />
							</Fragment>
						)}
					</FileUpload.Context>
				</FileUpload.Root>
			</Card.Body>
		</Card.Root>
	)
}
