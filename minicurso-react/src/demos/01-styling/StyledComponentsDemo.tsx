// RUIM — CSS gerado via JS em runtime: cada prop dinâmica vira classe com hash e reescreve a tag <style>.
// Sem suporte a RSC: nenhum estilo existe no servidor, o componente só rende no cliente.
import { useState } from "react";
import styled from "styled-components";
import { RenderCounter } from "../../components/RenderCounter";

const Wrapper = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #fff;
  padding: 16px;
`;

const InnerBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PlanTag = styled.span`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #4338ca;
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  border-radius: 999px;
  padding: 2px 10px;
`;

const PlanTitle = styled.strong`
  display: block;
  font-size: 18px;
  color: #0f172a;
`;

const PriceText = styled.div`
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #0f172a;

  small {
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
  }
`;

const Benefits = styled.ul`
  && {
    list-style: none;
    padding-left: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
`;

const BenefitRow = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #334155;

  &::before {
    content: "";
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #6366f1;
    flex-shrink: 0;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ActionButton = styled.button<{ $variant: "primary" | "outline" | "ghost" }>`
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  border: 1px solid transparent;

  ${(p) =>
    p.$variant === "primary" &&
    `
    background: #4f46e5;
    color: #fff;
    &:hover { background: #4338ca; }
  `}

  ${(p) =>
    p.$variant === "outline" &&
    `
    background: #fff;
    color: #1e1b4b;
    border-color: #c7d2fe;
    &:hover { background: #eef2ff; }
  `}

  ${(p) =>
    p.$variant === "ghost" &&
    `
    background: transparent;
    color: #475569;
    border-color: #e2e8f0;
    &:hover { background: #f8fafc; }
  `}
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(15, 23, 42, 0.45);
  display: grid;
  place-items: center;
  padding: 16px;
`;

const ModalBox = styled.div`
  width: 100%;
  max-width: 380px;
  background: #fff;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.25);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ModalTitle = styled.strong`
  font-size: 16px;
  color: #0f172a;
`;

const ModalInput = styled.input`
  font: inherit;
  font-size: 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 10px;
  width: 100%;
`;

export function StyledComponentsDemo() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [signedWith, setSignedWith] = useState<string | null>(null);

  return (
    <Wrapper>
      <InnerBox>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <PlanTag>Mais popular</PlanTag>
          <RenderCounter label="renders" />
        </div>
        <PlanTitle>Plano Pro</PlanTitle>
        <PriceText>
          R$ 79 <small>/mês</small>
        </PriceText>
        <Benefits>
          <BenefitRow>10 projetos</BenefitRow>
          <BenefitRow>Deploy automático</BenefitRow>
          <BenefitRow>100 GB de banda</BenefitRow>
          <BenefitRow>Suporte prioritário</BenefitRow>
        </Benefits>
        <Actions>
          {/* $variant: cada combinação vista vira uma classe com hash injetada no <head> */}
          <ActionButton $variant="primary">Assinar o Pro</ActionButton>
          <ActionButton $variant="outline">Falar com vendas</ActionButton>
          <ActionButton $variant="ghost" onClick={() => setOpen(true)}>
            Assinar com e-mail
          </ActionButton>
        </Actions>
        {signedWith && <small style={{ color: "#16a34a" }}>Link enviado para {signedWith}.</small>}
      </InnerBox>

      {open && (
        <ModalOverlay onClick={() => setOpen(false)}>
          <ModalBox
            role="dialog"
            aria-modal="true"
            aria-label="Confirmar assinatura"
            onClick={(e) => e.stopPropagation()}
          >
            <ModalTitle>Confirmar assinatura</ModalTitle>
            <label htmlFor="sc-email" style={{ fontSize: 13, color: "#475569" }}>
              E-mail de cobrança
            </label>
            <ModalInput
              id="sc-email"
              placeholder="voce@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Actions style={{ justifyContent: "flex-end" }}>
              <ActionButton $variant="ghost" onClick={() => setOpen(false)}>
                Cancelar
              </ActionButton>
              <ActionButton
                $variant="primary"
                onClick={() => {
                  setSignedWith(email || "voce@empresa.com");
                  setOpen(false);
                }}
              >
                Confirmar
              </ActionButton>
            </Actions>
          </ModalBox>
        </ModalOverlay>
      )}
    </Wrapper>
  );
}
