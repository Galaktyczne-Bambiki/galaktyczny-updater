import { createActorContext } from '@xstate/react'
import useWebSocket from 'react-use-websocket'
import { assign, setup } from 'xstate'
import { z } from 'zod/v4'
import { toaster } from '~/lib/toaster'

const updateMachine = setup({
	types: {
		context: {} as {
			messages: Array<{
				text: string
				level: MessageLevel
				timestamp: number
			}>
			percentage: number
			totalSteps: number
			steps: Array<{
				name: string
				number: number
			}>
		},
		events: {} as
			| Extract<WebsocketMessages, { type: 'message' }>
			| Extract<WebsocketMessages, { type: 'step' }>
			| { type: 'start' }
			| { type: 'failure' }
			| { type: 'success' }
			| { type: 'clearMessages' },
	},
}).createMachine({
	initial: 'idle',
	context: {
		messages: [],
		percentage: 0,
		steps: [],
		totalSteps: 0,
	},
	states: {
		idle: {
			on: {
				start: { target: 'updating' },
			},
		},
		updating: {
			on: {
				failure: { target: 'failure' },
				success: { target: 'success' },
				step: {
					actions: assign({
						steps: ({ context, event }) => {
							if (context.steps.find((step) => step.number === event.step)) {
								// Step already exists
								return context.steps
							}

							return context.steps.concat({ name: event.name, number: event.step })
						},
						totalSteps: ({ event }) => event.number,
						percentage: ({ event }) => Math.round((100 * (event.step - 1) + event.percent) / event.number),
					}),
				},
			},
		},
		success: {
			type: 'final',
		},
		failure: {
			type: 'final',
		},
	},
	on: {
		clearMessages: {
			actions: assign({ messages: [] }),
		},
		message: {
			actions: assign({
				messages: ({ context, event }) =>
					context.messages.concat({
						text: event.text,
						level: event.level,
						timestamp: Date.now(),
					}),
			}),
		},
	},
})

export const UpdateMachineContext = createActorContext(updateMachine)

export const useProcessUpdate = () => {
	const actor = UpdateMachineContext.useActorRef()
	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
	const url = `${protocol}//${window.location.host}${window.location.pathname.replace(/\/[^/]*$/, '')}/ws`

	const { readyState } = useWebSocket(url, {
		share: true,
		onMessage: (event) => {
			const { data, error } = WebsocketMessagesSchema.safeParse(JSON.parse(event.data))

			if (error) {
				console.error(error)

				return toaster.create({
					type: 'error',
					title: 'Parsing error',
					description: z.prettifyError(error),
				})
			}

			switch (data.type) {
				case 'message':
					actor.send(data)
					break
				case 'step':
					actor.send(data)
					break
				case 'status':
					switch (data.status) {
						case 'START':
							actor.send({ type: 'start' })
							break
						case 'SUCCESS':
							actor.send({ type: 'success' })
							break
						case 'FAILURE':
							actor.send({ type: 'failure' })
							break
						case 'DONE':
						case 'RUN':
						case 'IDLE':
						case 'DOWNLOAD':
							break
						default:
							data.status satisfies never
					}
					break
				case 'source':
				case 'info':
					break
				default:
					data satisfies never
			}
		},
	})

	return readyState
}

export enum MessageLevel {
	Emergency = '0',
	Alert = '1',
	Critical = '2',
	Error = '3',
	Warning = '4',
	Notification = '5',
	Info = '6',
	Debug = '7',
}

type WebsocketMessages = z.infer<typeof WebsocketMessagesSchema>

export const WebsocketMessagesSchema = z.discriminatedUnion('type', [
	// Status Change Event
	z.object({
		type: z.literal('status'),
		status: z.union([
			z.literal('IDLE'),
			z.literal('START'),
			z.literal('RUN'),
			z.literal('DOWNLOAD'),
			z.literal('SUCCESS'),
			z.literal('FAILURE'),
			z.literal('DONE'),
		]),
	}),
	// Source Event
	z.object({
		type: z.literal('source'),
		source: z.union([
			z.literal('UNKNOWN'),
			z.literal('WEBSERVER'),
			z.literal('SURICATTA'),
			z.literal('DOWNLOADER'),
			z.literal('LOCAL'),
		]),
	}),
	// Info Event
	z.object({
		type: z.literal('info'),
		source: z.string(),
	}),
	// Message Event
	z.object({
		type: z.literal('message'),
		level: z.enum(MessageLevel),
		text: z.string(),
	}),
	// Step Event
	z.object({
		type: z.literal('step'),
		number: z.coerce.number(),
		step: z.coerce.number(),
		name: z.string(),
		percent: z.coerce.number(),
	}),
])
