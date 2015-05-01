# gai

GDB Assembly Informant steps through your assembly code one instruction at a time and diffs register values.

## Installation

*Publish pending*

```
npm install -g gai
```

## Usage

### Preparation

Mark the sections of code you want to investigate with *start* `.gai_s` and *end* `.gai_e` labels.

As an example lets take [examples/inc.asm](examples/inc.asm):

```asm
global _start
; Initially all regs are 0x0 except for ESP and EIP
; EFLAGs are 0x202 (INTERRUPT flag set -- IF) and a reserved one?
_start:
  nop

.gai_s:                 ; gai instruction printing starts here
  inc eax               ; EAX: 0x1 - IF 
  inc eax               ; EAX: 0x2 - IF 

  mov eax, 0xffffffff   ; EAX: 0xffffffff - IF 
  inc eax               ; EAX: 0x0        - PF AF ZF IF
  inc eax               ; EAX: 0x1        - IF

.gai_e:                 ; gai instruction printing ends here
  mov eax,1
  mov ebx,0
  int 80H
```

Then assemble the file, i.e. see [examples/Makefile](examples/Makefile).

### gai-print

Launch the following command which will *batch debug* the executable with **gdb** and then pipe the output through
various scripts (see below) to generate the instructions including opcodes and information about modified registers.

```sh
gai-print examples/strlen
```

### gai-json

Works exactly like **gai-print** except that it outputs the information in JSON format to be parsed by other tools.

```sh
gai-json examples/strlen > out.json
```

## Troubleshooting

If something goes wrong, i.e. you get no output, have a look inside the `/tmp/gai__gdb_err.txt` to see if somehow the
**gdb** batch debugging failed to complete properly

You can then manually debug or run the following command to just run the **gdb** batch debug script:

```
gdb -nx --batch -x gai-gdb -f <your-executable>
```

## License

GPL3
