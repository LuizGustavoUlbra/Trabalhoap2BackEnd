const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ mensagem: 'Token não fornecido.' });
    }
    const [prefixo, tokenRecebido] = token.split(' ');
    
    if (prefixo !== 'Bearer') {
        return res.status(403).json({ mensagem: 'Token malformado.' });
    }
    
    jwt.verify(tokenRecebido, process.env.JWT_SECRET || 'meu-segredo-aqui', (erro, usuario) => {
        if (erro) {
            return res.status(403).json({ mensagem: 'Token inválido.' });
        }
    req.usuario = usuario;
    next();
    });
}
module.exports = verificarToken;