// RUIM — componente fechado em node_modules: para mudar o botão, o caminho é brigar
// com as classes internas (.ant-btn) com !important, e rezar para não quebrar no próximo update.
import { useState } from "react";
import { Button, Card, ConfigProvider, Input, Modal } from "antd";
import { RenderCounter } from "../../components/RenderCounter";
import "./antd-overrides.css";

const DESIGNER_THEME = {
  token: { colorPrimary: "#0e7490", borderRadius: 12 },
  components: {
    Button: { fontWeight: 700, primaryShadow: "0 6px 14px rgba(14, 116, 144, 0.35)" },
  },
};

export function AntdDemo() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [signedWith, setSignedWith] = useState<string | null>(null);

  function confirmar() {
    setSignedWith(email || "voce@empresa.com");
    setOpen(false);
  }

  return (
    <div className="antd-demo">
      <Card styles={{ body: { padding: 16 } }}>
        <div className="plan-head">
          <span className="plan-tag">Mais popular</span>
          <RenderCounter label="renders" />
        </div>
        <strong className="plan-title">Plano Pro</strong>
        <div className="plan-price">
          R$ 79 <small>/mês</small>
        </div>
        <ul className="plan-benefits">
          <li>10 projetos</li>
          <li>Deploy automático</li>
          <li>100 GB de banda</li>
          <li>Suporte prioritário</li>
        </ul>
        <div className="plan-actions">
          <Button type="primary">Assinar o Pro</Button>
          <Button>Falar com vendas</Button>
          <Button onClick={() => setOpen(true)}>Assinar com e-mail</Button>
        </div>
        {signedWith && <span className="plan-ok">Link enviado para {signedWith}.</span>}
      </Card>

      <div className="designer-box">
        <p className="muted" style={{ margin: 0, fontSize: 13 }}>
          O pedido do designer: botão com 12px de raio, cor própria e sombra diferente. Dois
          caminhos:
        </p>
        <div className="plan-actions" style={{ marginTop: 10 }}>
          <div className="designer-option">
            {/* className + CSS externo com !important: o override mora fora do React */}
            <Button className="botao-designer" onClick={() => setOpen(true)}>
              className + !important
            </Button>
            <small>vence na marra; classes .ant-* são detalhe interno</small>
          </div>
          <div className="designer-option">
            {/* Caminho oficial: tokens do ConfigProvider, sem tocar em CSS */}
            <ConfigProvider theme={DESIGNER_THEME}>
              <Button type="primary" onClick={() => setOpen(true)}>
                ConfigProvider + tokens
              </Button>
            </ConfigProvider>
            <small>theme token/component: sem !important</small>
          </div>
        </div>
      </div>

      <Modal
        title="Confirmar assinatura"
        open={open}
        onOk={confirmar}
        onCancel={() => setOpen(false)}
        okText="Confirmar"
        cancelText="Cancelar"
      >
        <p style={{ marginTop: 0 }}>Enviamos o link de ativação para este e-mail.</p>
        <Input
          placeholder="voce@empresa.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Modal>
    </div>
  );
}
