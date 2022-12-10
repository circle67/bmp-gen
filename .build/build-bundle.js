import esbuild from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

const config = {
	entryPoints: ['src/index.ts'],
	outdir: 'lib',
	platform: 'node',
	bundle: true,
	sourcemap: true,
	splitting: true,
	format: 'esm',
	target: ['es2022'],
	plugins: [nodeExternalsPlugin()],
};

async function buildBundle() {
	return await esbuild.build(config);
}

export default buildBundle;
