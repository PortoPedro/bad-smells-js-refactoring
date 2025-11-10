export class ReportGenerator {
    constructor(bancoDeDados) {
        this.db = bancoDeDados;
    }

    generateReport(tipoRelatorio, usuario, itens) {
        let cabecalho = this.gerarCabecalho(tipoRelatorio, usuario);
        const itensVisiveis = this.itensPorUser(usuario, itens);
        const corpo = this.gerarCorpo(tipoRelatorio, usuario, itensVisiveis);
        const total = this.calcularTotal(itensVisiveis);
        const rodape = this.gerarRodape(tipoRelatorio, total);
        return (cabecalho + corpo + rodape).trim();
    }

    // Cabeçalho 
    gerarCabecalho(tipoRelatorio, usuario) {
        if (tipoRelatorio === 'CSV') {
            return 'ID,NOME,VALOR,USUARIO\n';
        }
        if (tipoRelatorio === 'HTML') {
            return (
                '<html><body>\n' +
                '<h1>Relatório</h1>\n' +
                `<h2>Usuário: ${usuario.name}</h2>\n` +
                '<table>\n' +
                '<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>\n'
            );
        }
        return '';
    }

    // Filtro por tipo de usuário 
    itensPorUser(usuario, itens) {
        if (usuario.role === 'ADMIN') {
            return itens.map((item) => ({
                ...item,
                prioridade: item.value > 1000,
            }));
        }
        // Usuário comum - apenas itens com valor <= 500
        return itens.filter((item) => item.value <= 500);
    }

    // Corpo do relatório 
    gerarCorpo(tipoRelatorio, usuario, itens) {
        return itens
            .map((item) => this.formatarItem(tipoRelatorio, usuario, item))
            .join('');
    }

    formatarItem(tipoRelatorio, usuario, item) {
        if (tipoRelatorio === 'CSV') {
            return `${item.id},${item.name},${item.value},${usuario.name}\n`;
        }
        if (tipoRelatorio === 'HTML') {
            const estilo = item.prioridade ? 'style="font-weight:bold;"' : '';
            return `<tr ${estilo}><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>\n`;
        }
        return '';
    }

    // Cálculo do total 
    calcularTotal(itens) {
        return itens.reduce((soma, item) => soma + item.value, 0);
    }

    // Rodapé 
    gerarRodape(tipoRelatorio, total) {
        if (tipoRelatorio === 'CSV') {
            return `\nTotal,,\n${total},,\n`;
        }
        if (tipoRelatorio === 'HTML') {
            return `</table>\n<h3>Total: ${total}</h3>\n</body></html>\n`;
        }
        return '';
    }
}
