; vim: ft=nasm

section .text
global _start
_start:
  nop

.gai_s:
  inc eax
  inc eax

  mov eax, 0xffffffff
  inc eax
  inc eax

.gai_e:
  mov eax,1
  mov ebx,0
  int 80H
