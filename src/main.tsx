import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Layout } from '~/features/updater/Layout'
import './index.css'
import '@fontsource-variable/plus-jakarta-sans'
import { UpdateMachineContext } from '~/features/updater/useProcessUpdate'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<UpdateMachineContext.Provider>
			<Layout />
		</UpdateMachineContext.Provider>
	</StrictMode>,
)
