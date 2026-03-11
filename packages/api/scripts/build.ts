/**
 * Flashbid API Build Script
 *
 * Este script automatiza o processo de build otimizado da API:
 * 1. Bundling (com minificação e tree-shaking)
 * 2. Compilação para binário standalone
 */

import { join } from 'node:path';
import { spawnSync } from 'bun';

const entrypoint = 'src/index.ts';
const outDir = './dist';
const outFile = 'flashbid-api';
const fullPath = join(outDir, outFile);

console.log('🚀 Iniciando build otimizado da API...');

// 1. Bun.build para gerar o bundle JS otimizado
const buildResult = await Bun.build({
	entrypoints: [entrypoint],
	outdir: outDir,
	target: 'bun',
	minify: {
		whitespace: true,
		identifiers: true,
		syntax: true,
	},
	sourcemap: 'none', // Desativado para performance e tamanho de binário
	splitting: false, // Bundle único para facilitar compilação binária
});

if (!buildResult.success) {
	console.error('❌ Erro no Bundling:');
	for (const log of buildResult.logs) {
		console.error(log);
	}
	process.exit(1);
}

console.log('✅ Bundling concluído com sucesso.');

// 2. Compilação para Binário Standalone usando CLI
// Bun.build programático ainda não suporta --compile diretamente,
// então usamos spawnSync para invocar o comando de compilação
console.log(`📦 Compilando binário para ${fullPath}...`);

const compileResult = spawnSync(
	[
		'bun',
		'build',
		entrypoint,
		'--compile',
		'--minify',
		'--target',
		'bun',
		'--outfile',
		fullPath,
	],
	{
		stdout: 'inherit',
		stderr: 'inherit',
	},
);

if (compileResult.exitCode !== 0) {
	console.error('❌ Falha na compilação do binário.');
	process.exit(1);
}

console.log(`\n🎉 Build concluído!`);
console.log(`📍 Binário gerado em: ${fullPath}`);
console.log(`💡 Para rodar: ./${fullPath}`);
